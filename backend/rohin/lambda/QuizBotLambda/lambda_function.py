import boto3
import json

def lambda_handler(event, context):
    client = boto3.client('lexv2-runtime')

    user_text = event['text']

    try:
        response = client.recognize_text(
            botId='JJ6IHNJBT1',
            botAliasId='GGWVE7HMC0',
            localeId='en_US', 
            sessionId=event['username'],
            text=user_text
        )

        messages = response.get('messages', [])
        message_text = messages[0]['content'] if messages else ""

        return {
            'statusCode': 200,
            'body': {"message": message_text}
        }

    
    except Exception as e:
        return {
            'statusCode': 500,
            'body': {
                'error': f'Internal error: {str(e)}'
            }
        }
