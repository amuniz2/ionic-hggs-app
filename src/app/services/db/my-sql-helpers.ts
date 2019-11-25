export class MySqlHelpers {
  // private static final String AUTO_INCREMENT_PRIMARYKEY_DEFINITION = " _id integer primary key autoincrement, ";
  // private static final String CREATE_INDEX_COMMAND_FORMAT = "CREATE INDEX %s ON %s (%s);";
  public static BuildForeignKeyConstraintDefinition(columnName: string, referenceTableName: string, foreignKeyColumnName: string): string {
    return `FOREIGN KEY(${columnName}) REFERENCES ${referenceTableName}(${foreignKeyColumnName})`;
  }

  public static BuildUniqueConstraint(constraintName: string, ...columnNames: string[]) {
    return `CONSTRAINT ${constraintName} UNIQUE (${columnNames})`;
  }
}
