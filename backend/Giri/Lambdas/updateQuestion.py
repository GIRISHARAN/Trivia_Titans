import boto3

def lambda_handler(event, context):
    try:
        # Extract the update details from the event input
        uuid_key = event['uuidKey']
        question_category = event['questionCategory']
        new_question = event['question']
        new_question_level = event['questionLevel']
        new_correct_answer = event['correctAnswer']
        new_options = event['options']
        
        # Create a Boto3 DynamoDB client
        dynamodb_client = boto3.client('dynamodb')
        
        # Build the update expression and attribute values
        update_expression = "SET question = :question, questionLevel = :questionLevel, correctAnswer = :correctAnswer, options = :options"
        expression_attribute_values = {
            ':question': {'S': new_question},
            ':questionLevel': {'S': new_question_level},
            ':correctAnswer': {'S': new_correct_answer},
            ':options': {'SS': new_options}
        }
        
        # Update the item in the DynamoDB table
        response = dynamodb_client.update_item(
            TableName='QuizQuestions',
            Key={
                'uuidKey': {'S': uuid_key},
                'questionCategory': {'S': question_category}
            },
            UpdateExpression=update_expression,
            ExpressionAttributeValues=expression_attribute_values
        )
        
        # Return a success message
        return {
            'statusCode': 200,
            'body': 'Question updated successfully'
        }
    
    except Exception as e:
        # Return a 500 error if an exception occurs
        return {
            'statusCode': 500,
            'body': 'An error occurred: {}'.format(str(e))
        }
