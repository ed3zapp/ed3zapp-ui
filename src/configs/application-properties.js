export const db_sql_properties = {
    sql_delete_entries: "DELETE FROM {0};",
    sql_user_table_entries: "INSERT INTO {0} (userAddress, userType, creationDate) VALUES ('{1}', {2}, datetime('now', 'localtime'));",
    sql_cc_table_entries: "INSERT INTO {0} (userName, userAddress, userBio, creationDate) VALUES ('{1}', '{2}', '{3}', datetime('now', 'localtime'));",
    sql_learners_table_entries: "INSERT INTO {0} (userName, userAddress, userBio, creationDate) VALUES ('{1}', '{2}', '{3}', datetime('now', 'localtime'));",
    sql_get_user_type: "SELECT userType FROM {0} WHERE userAddress='{1}';",
    sql_get_cc_id: "SELECT id FROM {0} WHERE userAddress='{1}';",
    sql_grant_access: "GRANT INSERT,UPDATE ON {0} TO '{1}';"
};

export const application_properties = {
    contract_address: "0xC269e726B572Ad444df1BfC3197ebBE62F34daBb"
};