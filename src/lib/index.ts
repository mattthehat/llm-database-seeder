// place files you want to import through the `$lib` alias in this folder.

type GetAIRowsConfig = {
    num_rows: number;
    table: string;
    rows: {
        column: string;
        type: string;
        min_length: string;
        max_length: string;
        errors: {
            column: string;
            type: string;
            min_length: string;
            max_length: string;
        };
    }[];
};

const typeAliasesPrompts: { [key: string]: string } = {
    first_name: 'First Name',
    last_name: 'Last Name',
    email: 'Email Address',
    phone: 'Phone Number',
    address: 'Address',
    city: 'City',
    state: 'State',
    zip: 'Zip Code',
    country: 'Country',
    date: 'Date',
    datetime: 'Date and Time',
    time: 'Time',
    timestamp: 'Timestamp',
    year: 'Year',
    month: 'Month',
    day: 'Day',
    text: 'Text',
    password: 'Password (Hashed)',
    username: 'Username',
    url: 'URL',
    ip: 'IP Address',
    mac: 'MAC Address',
    html: 'HTML',
    job: 'Job Title',
    company: 'Company Name',
};

export async function getAIRows(config: GetAIRowsConfig) {
    let errors: { [k: string]: string } = {};

    if (config.num_rows < 1) {
        errors['num_rows'] = 'Number of rows must be greater than 0';
    }

    if (config.table === '') {
        errors['table'] = 'Table name cannot be empty';
    }

    for (const row of config.rows) {
        if (row.column === '') {
            row.errors['column'] = 'Column name cannot be empty';
        }

        if (row.type === '') {
            row.errors['type'] = 'Type cannot be empty';
        }
    }

    if (Object.keys(errors).length > 0) {
        return { rows: config.rows, errors, sql: '' };
    }

    let prompt =
        'You are going to act as a database seeder. You will be asked to provide the following information for each row: \n';

    prompt += 'Table: ' + config.table + '\n';

    for (const row of config.rows) {
        let rowPrompt = '';

        if (typeAliasesPrompts[row.type]) {
            rowPrompt +=
                typeAliasesPrompts[row.type] +
                ' with a length between ' +
                (row.min_length ?? 5) +
                ' and ' +
                (row.max_length ?? 20) +
                ': inserted into ' +
                row.column +
                '\n';
        } else {
            rowPrompt += row.type + ': ';
        }

        prompt += rowPrompt;
    }

    prompt += 'Ensure that each row is unique. \n';

    prompt += 'You will be asked to provide ' + config.num_rows + ' rows. \n';

    prompt +=
        'Return the results in a .sql format, make sure to include backticks where appropriot. Do not include any comments or ```sql at start or end of the response. The only out should be the SQL statement \n';

    const res = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        body: JSON.stringify({
            model: 'llama3',
            prompt,
            stream: false,
            options: {
                num_ctx: 17200,
            },
        }),
    });

    if (res.status !== 200) {
        errors.server = 'Failed to generate rows';
        return { rows: config.rows, errors, sql: '' };
    }

    const data = await res.json();

    return {
        sql: data.response,
        rows: config.rows,
        errors,
    };
}
