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
    sql_get_cc_courses: "SELECT cc_courses.id, cc_courses.ccId, cc_courses.name, cc_courses.description, cc_courses.topic, \
                            cc_courses.price, cc_courses.rewards, cc_courses.totalRating, cc_courses.ratingCount, cc_courses.creationDate \
                            FROM {0} as users \
                                JOIN {1} as cc \
                                JOIN {2} as cc_courses \
                                WHERE users.userAddress = cc.userAddress \
                                AND cc.id = cc_courses.ccId \
                                AND users.userAddress='{3}';",
    sql_get_cc_course_modules: "SELECT cc_modules.ccCourseId, cc_modules.name, cc_modules.description, cc_modules.videoURL, cc_modules.questionnaireURL, \
                                    cc_modules.maxAttempts, cc_modules.rewardPrice, cc_modules.rewardValidity, cc_modules.creationDate \
                                    FROM {0} as users \
                                        JOIN {1} as cc \
                                        JOIN {2} as cc_courses \
                                        JOIN {3} as cc_modules \
                                        WHERE users.userAddress = cc.userAddress \
                                        AND cc.id = cc_courses.ccId \
                                        AND cc_courses.id = cc_modules.ccCourseId \
                                        AND cc_modules.ccCourseId = {4} \
                                        AND users.userAddress='{5}';",
    sql_grant_access: "GRANT INSERT,UPDATE ON {0} TO '{1}';"
};

export const application_properties = {
    contract_address: "0x82988C3B405960026DFF566F282E8B4f4fDb808E"
};



