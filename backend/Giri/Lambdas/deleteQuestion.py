import boto3

def lambda_handler(event, context):
    # Retrieve the UUID key and question level from the event
    uuid_key = event['uuid']
    questionCategory = event['questionCategory']
    quiz_number = event['quizNumber']

    # Create a Boto3 DynamoDB client
    dynamodb_client = boto3.client('dynamodb')

    # Specify the table names
    quiz_questions_table_name = 'QuizQuestions'
    quizzes_table_name = 'Quizzes'

    try:
        # Delete the item from the QuizQuestions table
        delete_question_key_values = {
            'uuidKey': {'S': uuid_key},
            'questionCategory': {'S': questionCategory}
        }
        delete_question_item_request = {
            'TableName': quiz_questions_table_name,
            'Key': delete_question_key_values
        }
        dynamodb_client.delete_item(**delete_question_item_request)

        # Delete the UUID from the quizQuestionNumbers in the Quizzes table
        update_quiz_key_values = {
            'quizNumber': {'S': quiz_number}
        }
        update_quiz_expression_attribute_values = {
            ':uuidKey': {'SS': [uuid_key]}
        }
        update_quiz_expression = 'DELETE quizQuestionNumbers :uuidKey'
        update_quiz_item_request = {
            'TableName': quizzes_table_name,
            'Key': update_quiz_key_values,
            'UpdateExpression': update_quiz_expression,
            'ExpressionAttributeValues': update_quiz_expression_attribute_values
        }
        dynamodb_client.update_item(**update_quiz_item_request)

        # Return a success response
        return {
            'statusCode': 200,
            'body': 'Item deleted successfully'
        }
    except Exception as e:
        print(e)
        
        # Return an error response
        return {
            'statusCode': 500,
            'body': 'Error occurred during item deletion'
        }
