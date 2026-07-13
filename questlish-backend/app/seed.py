from app.database import SessionLocal, engine, Base
from app.models import MiniGame, MiniGameToken, User

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # 1. Crear usuario de prueba por defecto si no existe
    default_user = db.query(User).filter(User.id == 1).first()
    if not default_user:
        user = User(
            id=1,
            name="Jonatan Pulig",
            email="demo@questlish.local",
            hashed_password="demo_password_hash",
            current_level="B1",
            total_xp=0,
            streak_days=1
        )
        db.add(user)
        print("👤 Usuario demo creado (ID: 1)")

    # 2. Crear Minijuegos B1 alineados con el frontend
    minigame_specs = [
        {
            "id": "grammar-ninja",
            "title": "Grammar Ninja",
            "description": "Choose the correct tense for a university project update.",
            "category": "Grammar",
            "level": "B1",
            "plays_count": "1.2k plays",
            "tag": "HOT",
            "instruction": "Select the correct word to complete the sentence.",
            "prompt": "Our research team _____ the survey results during the presentation.",
            "correct_token_index": 0,
            "tokens": [
                {"word": "has reviewed", "explanation": "Correct. Present perfect works because the action is recent and relevant to the presentation now.", "token_order": 0},
                {"word": "reviewed", "explanation": "Incorrect. Simple past is possible for finished actions, but the sentence focuses on the current result.", "token_order": 1},
                {"word": "is reviewing", "explanation": "Incorrect. The present continuous does not fit a completed action during the presentation.", "token_order": 2},
                {"word": "reviews", "explanation": "Incorrect. The third-person singular form does not match the subject 'Our research team'.", "token_order": 3},
            ],
        },
        {
            "id": "sentence-builder",
            "title": "Sentence Builder",
            "description": "Build clear academic sentences for class discussions.",
            "category": "Grammar",
            "level": "B1",
            "plays_count": "980 plays",
            "tag": "NEW",
            "instruction": "Choose the best option to complete the sentence.",
            "prompt": "During the seminar, the professor asked us to _____ our ideas clearly.",
            "correct_token_index": 1,
            "tokens": [
                {"word": "presenting", "explanation": "Incorrect. After 'asked us to,' the base form of the verb is required.", "token_order": 0},
                {"word": "present", "explanation": "Correct. The base verb follows 'asked us to' and fits the academic context naturally.", "token_order": 1},
                {"word": "presented", "explanation": "Incorrect. Past tense is not used after 'asked us to' in this structure.", "token_order": 2},
                {"word": "to present", "explanation": "Incorrect. The infinitive marker is already included in 'asked us to'.", "token_order": 3},
            ],
        },
        {
            "id": "tense-master",
            "title": "Tense Master",
            "description": "Practice future perfect with deadlines and presentations.",
            "category": "Grammar",
            "level": "B1",
            "plays_count": "760 plays",
            "tag": "HOT",
            "instruction": "Pick the correct tense for the context.",
            "prompt": "By the time the thesis defense starts, I _____ all my slides.",
            "correct_token_index": 0,
            "tokens": [
                {"word": "will have finished", "explanation": "Correct. Future perfect shows that the work will be completed before a future point.", "token_order": 0},
                {"word": "finish", "explanation": "Incorrect. The base form does not express completion before a future deadline.", "token_order": 1},
                {"word": "have finished", "explanation": "Incorrect. The sentence needs the full future perfect form with 'will'.", "token_order": 2},
                {"word": "finished", "explanation": "Incorrect. The past participle alone does not show the future timing.", "token_order": 3},
            ],
        },
        {
            "id": "word-match-adventure",
            "title": "Word Match Adventure",
            "description": "Match university words with their meanings in context.",
            "category": "Vocabulary",
            "level": "B1",
            "plays_count": "1.5k plays",
            "tag": "TOP",
            "instruction": "Choose the word that matches the definition.",
            "prompt": "A student who studies data and writes reports for a project is a _____.",
            "correct_token_index": 2,
            "tokens": [
                {"word": "tourist", "explanation": "Incorrect. A tourist visits a place for leisure, not for academic work.", "token_order": 0},
                {"word": "speaker", "explanation": "Incorrect. A speaker gives a talk, but that does not describe the student's role here.", "token_order": 1},
                {"word": "researcher", "explanation": "Correct. A researcher studies information and writes reports in academic contexts.", "token_order": 2},
                {"word": "roommate", "explanation": "Incorrect. A roommate shares a room, not the academic task described.", "token_order": 3},
            ],
        },
        {
            "id": "synonym-challenge",
            "title": "Synonym Challenge",
            "description": "Find the best synonym for academic and classroom language.",
            "category": "Vocabulary",
            "level": "B1",
            "plays_count": "2.1k plays",
            "tag": "HOT",
            "instruction": "Choose the word closest in meaning.",
            "prompt": "In a presentation, 'important' is closest in meaning to _____.",
            "correct_token_index": 0,
            "tokens": [
                {"word": "significant", "explanation": "Correct. 'Significant' is a strong synonym for 'important' in academic speech and writing.", "token_order": 0},
                {"word": "quiet", "explanation": "Incorrect. This word describes sound level, not importance.", "token_order": 1},
                {"word": "basic", "explanation": "Incorrect. 'Basic' means simple or elementary, which is not the same as 'important'.", "token_order": 2},
                {"word": "temporary", "explanation": "Incorrect. 'Temporary' refers to duration, not importance.", "token_order": 3},
            ],
        },
        {
            "id": "sound-quest",
            "title": "Sound Quest",
            "description": "Listen for word stress in university vocabulary.",
            "category": "Pronunciation",
            "level": "B1",
            "plays_count": "640 plays",
            "tag": "NEW",
            "instruction": "Choose the word with stress on the second syllable.",
            "prompt": "Which word has the stress on the second syllable?",
            "correct_token_index": 1,
            "tokens": [
                {"word": "campus", "explanation": "Incorrect. The stress is on the first syllable: CAM-pus.", "token_order": 0},
                {"word": "report", "explanation": "Correct. The stress falls on the second syllable: re-PORT.", "token_order": 1},
                {"word": "lecture", "explanation": "Incorrect. The stress is on the first syllable: LEC-ture.", "token_order": 2},
                {"word": "project", "explanation": "Incorrect. In the noun form, the stress is on the first syllable: PRO-ject.", "token_order": 3},
            ],
        },
    ]

    for spec in minigame_specs:
        existing_game = db.query(MiniGame).filter(MiniGame.id == spec["id"]).first()

        if existing_game:
            existing_game.title = spec["title"]
            existing_game.description = spec["description"]
            existing_game.category = spec["category"]
            existing_game.level = spec["level"]
            existing_game.plays_count = spec["plays_count"]
            existing_game.tag = spec["tag"]
            existing_game.instruction = spec["instruction"]
            existing_game.prompt = spec["prompt"]
            existing_game.correct_token_index = spec["correct_token_index"]

            db.query(MiniGameToken).filter(MiniGameToken.minigame_id == spec["id"]).delete(synchronize_session=False)
            print(f"🔄 Minijuego '{spec['title']}' actualizado.")
        else:
            db.add(
                MiniGame(
                id=spec["id"],
                title=spec["title"],
                description=spec["description"],
                category=spec["category"],
                level=spec["level"],
                plays_count=spec["plays_count"],
                tag=spec["tag"],
                instruction=spec["instruction"],
                prompt=spec["prompt"],
                correct_token_index=spec["correct_token_index"],
                )
            )
            print(f"🎮 Minijuego '{spec['title']}' guardado con éxito.")

        for token in spec["tokens"]:
            db.add(
                MiniGameToken(
                    minigame_id=spec["id"],
                    word=token["word"],
                    explanation=token["explanation"],
                    token_order=token["token_order"],
                )
            )

    db.commit()
    db.close()

if __name__ == "__main__":
    seed_database()