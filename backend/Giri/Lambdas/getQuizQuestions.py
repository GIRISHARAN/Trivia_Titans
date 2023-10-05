import boto3

def get_question_details(question_id, question_category):
    # Create a DynamoDB client
    dynamodb = boto3.client('dynamodb')

    # Define the get_item parameters
    get_item_params = {
        'TableName': 'QuizQuestions',
        'Key': {
            'uuidKey': {'S': question_id},
            'questionCategory': {'S': question_category}
        },
        'ProjectionExpression': 'uuidKey, questionCategory, questionLevel, correctAnswer, options, question, questionTag'
    }

    # Retrieve the item from the DynamoDB table
    response = dynamodb.get_item(**get_item_params)

    item = response.get('Item', {})
    question_details = {
        'uuidKey': item.get('uuidKey', {}).get('S', None),
        'questionCategory': item.get('questionCategory', {}).get('S', None),
        'questionLevel': item.get('questionLevel', {}).get('S', None),
        'correctAnswer': item.get('correctAnswer', {}).get('S', None),
        'options': item.get('options', {}).get('SS', []),
        'questionTag': item.get('questionTag', {}).get('SS', []),
        'question': item.get('question', {}).get('S', None)
    }

    return question_details

def lambda_handler(event, context):
    # Get the quizNumber from the request body
    quiz_number = event['quizNumber']
    
    # Create a DynamoDB client
    dynamodb = boto3.client('dynamodb')
    
    try:
        # Retrieve the item from the DynamoDB table
        response = dynamodb.get_item(
            TableName='Quizzes',
            Key={
                'quizNumber': {'S': quiz_number}
            },
            ProjectionExpression='quizNumber,quizCategory,quizQuestionNumbers'
        )
        
        # Check if the item exists in the DynamoDB response
        if 'Item' not in response:
            return {
                'statusCode': 404,
                'body': 'Quiz not found'
            }
        
        # Extract the quizQuestionNumbers list values from the response
        quiz_question_numbers = response['Item']['quizQuestionNumbers']['SS']
        question_category = response['Item']['quizCategory']['S']
        
        # Retrieve question details for each question number
        questions = []
        for question_id in quiz_question_numbers:
            question_details = get_question_details(question_id, question_category)
            questions.append(question_details)
        
        # Create the response dictionary
        response_body = {
            'questions': questions
        }
        
        # Return the response
        return {
            'statusCode': 200,
            'body': response_body
        }
    except Exception as e:
        # Handle any errors that occur during the retrieval
        return {
            'statusCode': 500,
            'body': str(e)
        }
