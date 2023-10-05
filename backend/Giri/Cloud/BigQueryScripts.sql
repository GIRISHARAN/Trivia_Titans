SELECT DISTINCT
  JSON_EXTRACT(data, '$.team_id') AS team_id,
  CAST(JSON_EXTRACT(data, '$.total_points') AS INT64) AS total_team_points
FROM `b00913674serverlessgcp.teams_points_dataset.teams_points_raw_changelog`
WHERE JSON_EXTRACT(data, '$.team_id') IS NOT NULL
  AND JSON_EXTRACT(data, '$.total_points') IS NOT NULL
ORDER BY total_team_points DESC;




SELECT DISTINCT
  JSON_EXTRACT(data,'$.user_id') AS User_Id,
  JSON_EXTRACT(data, '$.user_name') AS UserName,
  CAST(JSON_EXTRACT(data, '$.points') AS INT64) AS User_Individual_Points
  JSON_EXTRACT(data,'$.team_id') AS Team_Id
FROM `b00913674serverlessgcp.persons_points_dataset.persons_points_raw_changelog`
where JSON_EXTRACT(data,'$.user_id') is NOT NULL 
and JSON_EXTRACT(data, '$.user_name') is NOT NULL 
and JSON_EXTRACT(data, '$.points') is NOT NULL