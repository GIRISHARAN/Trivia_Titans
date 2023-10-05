import boto3
import uuid

def lambda_handler(event, context):
    try:
        # Extract the new question details from the event input
        new_question_category = event['questionCategory']
        new_question = event['question']
        new_question_level = event['questionLevel']
        new_correct_answer = event['correctAnswer']
        new_options = event['options']
        quiz_number = event['quizNumber']
        new_question_tag = event['questionTag']
        
        # Generate a unique UUID for the new item
        new_uuid = str(uuid.uuid4())
        
        # Create a Boto3 DynamoDB client
        dynamodb_client = boto3.client('dynamodb')
        
        # Build the item to be added to the QuizQuestions table
        item = {
            'uuidKey': {'S': new_uuid},
            'questionCategory': {'S': new_question_category},
            'questionLevel': {'S': new_question_level},
            'correctAnswer': {'S': new_correct_answer},
            'options': {'SS': new_options},
            'questionTag': {'SS': new_question_tag},
            'question': {'S': new_question}
        }
        
        # Put the new item into the QuizQuestions table
        response = dynamodb_client.put_item(
            TableName='QuizQuestions',
            Item=item
        )
        
        # Update the Quizzes table with the new UUID
        quizzes_table = dynamodb_client.update_item(
            TableName='Quizzes',
            Key={
                'quizNumber': {'S': str(quiz_number)}
            },
            UpdateExpression='ADD quizQuestionNumbers :uuid',
            ExpressionAttributeValues={
                ':uuid': {'SS': [new_uuid]}
            }
        )
        
        # Return a success message
        return {
            'statusCode': 200,
            'body': 'New question added successfully'
        }
    
    except Exception as e:
        # Return a 500 error if an exception occurs
        return {
            'statusCode': 500,
            'body': 'An error occurred: {}'.format(str(e))
        }
