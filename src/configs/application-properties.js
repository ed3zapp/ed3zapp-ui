export const db_sql_properties = {
    sql_delete_entries: "DELETE FROM {0};",
    sql_user_table_entries: "INSERT INTO {0} (userAddress, userType) VALUES ('{1}', {2});",
    sql_cc_table_entries: "INSERT INTO {0} (userName, userAddress, userBio) VALUES ('{1}', '{2}', '{3}');",
    sql_learners_table_entries: "INSERT INTO {0} (userName, userAddress, userBio) VALUES ('{1}', '{2}', '{3}');",
    sql_cc_courses_table_entries: "INSERT INTO {0} (ccId, name, description, topic, price, rewards) VALUES ({1}, '{2}', '{3}', '{4}', {5}, {6});",
    sql_cc_course_modules_table_entries: "INSERT INTO {0} (ccCourseId, name, description, videoURL, questionnaireURL, maxAttempts, rewardPrice, rewardValidity) VALUES ({1}, '{2}', '{3}', '{4}', '{5}', {6}, {7}, {8});",
    sql_get_user_type: "SELECT userType FROM {0} WHERE userAddress='{1}';",
    sql_get_cc_id: "SELECT id FROM {0} WHERE userAddress='{1}';",
    sql_get_cc_course_id: "SELECT id FROM {0} WHERE ccId='{1}';",
    sql_get_cc_courses: "SELECT * FROM {0} WHERE ccId={1};",
    sql_get_cc_course_modules: "SELECT * FROM {0} WHERE ccCourseId={1};",
    sql_grant_access: "GRANT INSERT,UPDATE ON {0} TO '{1}';"
};

export const application_properties = {
    contract_address: "0xC269e726B572Ad444df1BfC3197ebBE62F34daBb"
};