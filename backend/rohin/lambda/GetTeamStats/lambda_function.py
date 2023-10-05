import boto3
import json
from decimal import Decimal

dynamodb = boto3.resource('dynamodb')
teams_table = dynamodb.Table('teams')

def decimal_to_number(obj):
    if isinstance(obj, Decimal):
        if obj % 1 == 0:
            return int(obj)
        else:
            return float(obj)
    raise TypeError("Type not serializable")

def get_team_statistics(event, context):
    try:
        team_id = event['pathParameters']['team_id']

        # Try fetching the team item
        result = teams_table.get_item(Key={'team_id': team_id})
        
        # Check if the team does not exist
        if 'Item' not in result:
            return {
                'statusCode': 400,
                'body': json.dumps({'success':False, 'error': 'Team ID does not exist'})
            }

        team = result['Item']
        team_statistics_value = team.get('statistics', None)

        response = {
            'statusCode': 200,
            'body': json.dumps({'success':True,'team_statistics': team_statistics_value} , default=decimal_to_number)
        }

        return response

    except Exception as e:
        # Return a 500 error for unexpected exceptions
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'Internal server error', 'details': str(e)})
        }

