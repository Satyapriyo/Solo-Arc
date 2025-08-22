-- Check if your profile exists
SELECT * FROM profiles WHERE id = '0399431a-98d1-42fa-9643-8da3093c13fb';

-- Check all profiles in the database  
SELECT id, name, email FROM profiles;

-- Check if the UUID format is correct
SELECT 
    id,
    name,
    email,
    length(id::text) as id_length,
    id::text as id_as_string
FROM profiles;
