import pymysql

connection = pymysql.connect(
    host='::1',
    port=3307,
    user='root',
    password='Alex32@NAM;',
    database='FitnessProject'
)

with open('fix_db.sql', 'r', encoding='utf-8') as f:
    sql = f.read()

statements = sql.split(';')
try:
    with connection.cursor() as cursor:
        for stmt in statements:
            stmt = stmt.strip()
            if stmt:
                print(f"Executing: {stmt[:50]}...")
                cursor.execute(stmt)
    connection.commit()
    print("Success")
except Exception as e:
    print(f"Error: {e}")
finally:
    connection.close()
