def pack_employees(employees, offset, limit, sort_column, order):
    sorted_employees = sorted(employees, key=lambda emp: emp[sort_column], reverse=order)
    packed_employees = []
    for emp in sorted_employees:
        packed_employees.append({'id':emp['id'], 'name': emp['name'],
            'login': emp['login'], 'salary': emp['salary']})

    return packed_employees[offset:offset + limit]
