import json
import boto3

def lambda_handler(event, context):
    # Retrieve the question category and level from the event
    question_category = event['questionCategory']
    question_level = event['questionLevel']

    # Create a DynamoDB client
    dynamodb = boto3.client('dynamodb')

    # Define the scan parameters
    scan_params = {
        'TableName': 'QuizQuestions',
        'FilterExpression': 'questionCategory = :category and questionLevel = :level',
        'ExpressionAttributeValues': {
            ':category': {'S': question_category},
            ':level': {'S': question_level}
        },
        'ProjectionExpression': 'uuidKey, questionCategory, questionLevel, correctAnswer, options, question'
    }

    # Scan the DynamoDB table
    response = dynamodb.scan(**scan_params)

    # Extract the items from the response
    items = response['Items']

    # Extract the required fields and create the response dictionary
    questions = [
        {
            "uuidKey": item['uuidKey']['S'],
            "questionCategory": item['questionCategory']['S'],
            "questionLevel": item['questionLevel']['S'],
            "correctAnswer": item['correctAnswer']['S'],
            "options": item['options']['SS'],
            "question": item['question']['S']
        }
        for item in items
    ]

    # Format the response
    response_body = {
        'questions': questions
    }

    # Return the response
    return response_body
