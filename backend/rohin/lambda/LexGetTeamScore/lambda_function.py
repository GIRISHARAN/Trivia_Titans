import boto3
import json


dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('teams')

def lex_v2_response(message_content):
    return {
        "sessionState": {
            "dialogAction": {
                "type": "ElicitIntent"  # Awaiting next user input
            },
            "intent": {
                "name": "GetTeamScore",
                "state": "InProgress"  # Setting intent state as InProgress
            }
        },
        "messages": [  # Using messages at top-level
            {
                "contentType": "PlainText",
                "content": message_content
            }
        ]
    }

def lambda_handler(event, context):
    try:

        team_name = event['sessionState']['intent']['slots']['teamName']['value']['originalValue']

        if not team_name:
            return lex_v2_response('team_name not provided')

        # Scan the DynamoDB table for the team's data
        response = table.scan(
            FilterExpression=boto3.dynamodb.conditions.Attr('team_name').eq(team_name)
        )
        
        # Check if a result is found
        items = response.get('Items')
        if not items:
            return lex_v2_response(f'Team {team_name} not found')

        team_data = items[0]
        team_score = team_data['statistics'].get('points')

        return lex_v2_response(f'Points Scored by {team_name} is {team_score}')

    except Exception as e:
        return lex_v2_response('Internal Server Error')
