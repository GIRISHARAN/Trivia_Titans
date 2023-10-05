import requests
import random

GPT_API_URL = 'https://api.openai.com/v1/chat/completions'
GPT_API_KEY = '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'

adjectives = [
    'Amazing', 'Awesome', 'Beautiful', 'Brilliant', 'Cheerful', 'Creative', 'Delightful', 'Elegant',
    'Enthusiastic', 'Excellent', 'Extraordinary', 'Fabulous', 'Fantastic', 'Glorious', 'Graceful', 'Happy',
    'Harmonious', 'Inspiring', 'Joyful', 'Kind', 'Lovely', 'Magnificent', 'Marvellous', 'Miraculous',
    'Outstanding', 'Passionate', 'Perfect', 'Positive', 'Radiant', 'Remarkable', 'Sensational', 'Splendid',
    'Stunning', 'Superb', 'Terrific', 'Thrilling', 'Tranquil', 'Vibrant', 'Victorious', 'Wonderful',
    'Wondrous', 'Amazing', 'Blissful', 'Breathtaking', 'Charming', 'Enchanting', 'Exhilarating', 'Fantastic',
    'Incredible', 'Mesmerizing', 'Optimistic', 'Phenomenal', 'Spectacular', 'Stupendous', 'Unbelievable',
    'Unforgettable', 'Unicorn-like', 'Unreal', 'Uplifting', 'Whimsical', 'Wondrous'
]


animals = [
    'Tiger', 'Lion', 'Eagle', 'Wolf', 'Panther', 'Falcon', 'Bear', 'Jaguar', 'Giraffe', 'Elephant', 'Kangaroo',
    'Panda', 'Koala', 'Zebra', 'Cheetah', 'Leopard', 'Gorilla', 'Rhino', 'Hippo', 'Orangutan', 'Llama', 'Ostrich',
    'Peacock', 'Kookaburra', 'Dolphin', 'Whale', 'Shark', 'Seahorse', 'Octopus', 'Penguin', 'Sloth', 'Kangaroo',
    'Koala', 'Raccoon', 'Otter', 'Meerkat', 'Hedgehog', 'Chipmunk', 'Squirrel', 'Rabbit', 'Deer', 'Polar Bear',
    'Penguin', 'Kangaroo', 'Giraffe', 'Elephant', 'Zebra', 'Gorilla', 'Turtle', 'Crocodile', 'Lizard', 'Frog',
    'Butterfly', 'Dragonfly', 'Ladybug', 'Bee', 'Ant', 'Firefly', 'Grasshopper', 'Caterpillar', 'Spider',
    'Scorpion', 'Beetle', 'Snail', 'Crab', 'Starfish', 'Jellyfish', 'Clownfish', 'Seahorse', 'Toucan', 'Hummingbird',
    'Owl', 'Parrot', 'Flamingo', 'Swan', 'Peacock', 'Woodpecker', 'Pigeon', 'Robin', 'Canary', 'Finch', 'Parakeet',
    'Cockatoo', 'Chameleon', 'Gecko', 'Iguana', 'Anaconda', 'Python', 'Cobra', 'Boa', 'Komodo Dragon', 'Alligator',
    'Mantis', 'Bee', 'Wasp', 'Cicada', 'Cricket', 'Grasshopper', 'Centipede','Scorpion','Beetle', 'Firefly', 'Dragonfly', 
    'Ladybug', 'Butterfly', 'Crab', 'Lobster', 'Starfish', 'Jellyfish', 'Oyster', 'Squid', 'Nautilus', 'Octopus'
]


def generate_team_name(event, context):
    try:
        prompt = "Generate a Team Name of Two Words One being Positive Adjective While Other being cute animal/insect."
        headers = {'Authorization': f'Bearer {GPT_API_KEY}', 'Content-Type': 'application/json'}
        data = {
                    "model": "gpt-3.5-turbo",
                    "messages": [{"role": "user", "content": prompt}],
                    "temperature": 0.7
            }

        response = requests.post(GPT_API_URL, headers=headers, json=data)
        if response.status_code == 200:
            team_name = response.json()['choices'][0]['text'].strip()
        else:
            team_name = f'{random.choice(adjectives)} {random.choice(animals)}'

        return {
            'statusCode': 200,
            'team_name': team_name,
        }

    except Exception as e:
        # Return a 500 error for unexpected exceptions
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'Internal server error', 'details': str(e)}),
        }


    

