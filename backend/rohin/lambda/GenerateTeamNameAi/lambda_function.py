import requests
import json

GPT_API_URL = 'https://api.openai.com/v1/chat/completions'
GPT_API_KEY = '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'


def generate_ai_team_name(event, context):
    try:
        prompt = "Generate a unique Team Name of Two Words One being Good Adjective While Other being bird/animal/insect."
        headers = {'Authorization': f'Bearer {GPT_API_KEY}', 'Content-Type': 'application/json'}
        data = {
                    "model": "gpt-3.5-turbo",
                    "messages": [{"role": "user", "content": prompt}],
                    "temperature": 0.7
            }

        response = requests.post(GPT_API_URL, headers=headers, json=data)
        team_name = response.json()['choices'][0]['message']['content'].strip()

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