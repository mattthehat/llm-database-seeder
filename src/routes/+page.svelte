<script lang="ts">
    import { getAIRows } from '$lib';
    import FormField from '../components/FormField.svelte';
    import Icon from '@iconify/svelte';

    let rows: Array<{
        data: {
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
        };
    }> = [
        {
            data: {
                column: '',
                type: 'first_name',
                min_length: '',
                max_length: '',
                errors: {
                    column: '',
                    type: '',
                    min_length: '',
                    max_length: '',
                },
            },
        },
    ];

    let table = '';
    let num_rows = 5;
    let isLoading = false;
    let sql = '';

    let tableError = '';
    let rowsError = '';

    const onRowAdded = () => {
        rows = [
            ...rows,
            {
                data: {
                    column: '',
                    type: 'first_name',
                    min_length: '',
                    max_length: '',
                    errors: {
                        column: '',
                        type: '',
                        min_length: '',
                        max_length: '',
                    },
                },
            },
        ];
    };

    async function seedData() {
        isLoading = true;

        const data = {
            table,
            rows: rows.map((row) => row.data),
            num_rows,
        };

        const attempt = await getAIRows(data);

        if (attempt.sql) {
            sql = attempt.sql;
        }

        if (attempt.rows.some((row) => row.errors !== undefined)) {
            for (let i = 0; i < attempt.rows.length; i++) {
                rows[i].data.errors = attempt.rows[i].errors;
            }
        } else if (attempt?.errors !== undefined) {
            tableError = attempt.errors.table;
            rowsError = attempt.errors.rows;
        } else {
            sql = attempt.sql;
        }

        isLoading = false;
    }
</script>

<svelte:head>
    <title>Database Seeder</title>
</svelte:head>

<header class="header">
    <h1>
        <Icon
            icon="bi:database-fill"
            width="24"
            style="margin-right: 7px"
        />Database Seeder
    </h1>
</header>

<div class="table">
    <div class="table__group">
        <label for="table">Table</label>
        <input
            type="text"
            id="table"
            name="table"
            bind:value={table}
            placeholder="Enter table name..."
            aria-invalid={tableError ? 'true' : 'false'}
        />
        {#if tableError}
            <p class="table__group-error">{tableError}</p>
        {/if}
    </div>
</div>
<h4 style="margin-bottom: 7px;">Columns</h4>
<div class="fields">
    {#each rows as row, i}
        <div class="fields__row">
            <FormField bind:field={row.data} />
            {#if i > 0}
                <button
                    type="button"
                    class="fields__row-delete"
                    on:click={() => {
                        rows = rows.filter((_, index) => index !== i);
                    }}
                >
                    <Icon icon="ph:trash" />
                    Remove
                </button>
            {/if}
        </div>
    {/each}
</div>
<button class="add-btn" on:click={onRowAdded}>
    <Icon icon="akar-icons:plus" />
    Add Column
</button>
<div class="rows">
    <div class="rows__group">
        <label for="num_rows">Rows</label>
        <input
            type="number"
            id="num_rows"
            name="num_rows"
            max="300"
            bind:value={num_rows}
        />
    </div>
</div>
{#if rows.length > 0}
    <div class="submit">
        <button class="btn" on:click={seedData}>
            {#if isLoading}
                Generating SQL...
                <Icon icon="line-md:loading-alt-loop" width="16" height="16" />
            {:else}
                Generate SQL
            {/if}
        </button>
    </div>
{/if}
{#if sql}
    <textarea class="results" readonly rows="10" cols="30">{sql}</textarea>
{/if}

<style lang="scss">
    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1rem;
    }

    .table {
        display: flex;
        gap: 1rem;
        width: 100%;
        margin-bottom: 12px;

        &__group {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            width: 100%;
        }

        &__group > label {
            font-weight: bold;
        }

        &__group > input {
            padding: 0.5rem;
            border: 1px solid #ccc;
            border-radius: 0.25rem;
            flex: 1;

            &[aria-invalid='true'] {
                border-color: #9c2121;
            }
        }

        &__group-error {
            color: #9c2121;
            font-size: 10px;
        }
    }

    .add-btn {
        background-color: #007bff;
        color: #fff;
        border: none;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        border-radius: 0.25rem;
        cursor: pointer;
        margin-left: auto;
    }

    .fields {
        display: flex;
        flex-direction: column;
        gap: 1rem;

        &__row {
            display: flex;
            align-items: flex-end;
            justify-content: space-between;
            border: 1px solid #ccc;
            border-radius: 0.25rem;
            gap: 1rem;
            margin-bottom: 7px;
            padding: 7px;
            background-color: #fff;
        }

        &__row-delete {
            background-color: #9c2121;
            color: #fff;
            border: none;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem 1rem;
            border-radius: 0.25rem;
            cursor: pointer;
        }
    }

    .rows {
        display: flex;
        gap: 1rem;
        width: 100%;
        margin-bottom: 12px;
        margin-top: 12px;

        &__group {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            width: 100%;
        }

        &__group > label {
            font-weight: bold;
        }

        &__group > input {
            padding: 0.5rem;
            border: 1px solid #ccc;
            border-radius: 0.25rem;
            flex: 1;
        }
    }

    .submit {
        display: flex;
        margin-top: 12px;

        .btn {
            background-color: #007bff;
            color: #fff;
            border: none;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem 1rem;
            border-radius: 0.25rem;
            cursor: pointer;
        }
    }

    .results {
        margin-top: 12px;
        padding: 12px;
        border: 1px solid #ccc;
        border-radius: 0.25rem;
        background-color: #f9f9f9;
        width: 100%;
    }
</style>
