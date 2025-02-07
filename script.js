function parseCSV(data) {
    return data.split('\n').map(row => row.split(',').map(value => isNaN(Number(value)) ? value.trim() : Number(value)));
}

function calculateMonthlyShares(data) {
    const totalRevenue = data.reduce((sum, row) => sum + row[2], 0); 
    return data.map(row => ({
        period: row[0],
        salesVolume: row[1],
        revenue: row[2],
        cost: row[3],
        share: (row[2] / totalRevenue * 100).toFixed(2) + '%'
    }));
}

function calculateChanges(data) {
    const changes = [];
    for (let i = 1; i < data.length; i++) {
        const prev = data[i - 1];
        const current = data[i];

        // Чек корректность
        if (typeof prev[2] !== 'number' || typeof current[2] !== 'number') continue;

        changes.push({
            period: current[0],
            revenueChange: (current[2] - prev[2]).toFixed(2),
            revenueChangePercent: prev[2] !== 0 ? (((current[2] - prev[2]) / prev[2]) * 100).toFixed(2) + '%' : 'N/A',
            salesChange: (current[1] - prev[1]).toFixed(2),
            costChange: (current[3] - prev[3]).toFixed(2)
        });
    }
    return changes;
}

function performFactorAnalysis() {
    const input = document.getElementById('dataInput').value;
    if (!input.trim()) {
        alert('Введите данные для анализа.');
        return;
    }

    const rawData = parseCSV(input);
    if (rawData.length < 2) {
        alert('Недостаточно данных. Убедитесь, что вы ввели данные с заголовками и как минимум одной строкой значений.');
        return;
    }

    const headers = rawData[0];
    const data = rawData.slice(1).filter(row => row.length === headers.length);

    const monthlyShares = calculateMonthlyShares(data);
    const changes = calculateChanges(data);

    const output = document.getElementById('output');
    output.innerHTML = `
        <h3>Результаты анализа:</h3>
        <h4>Структура доходов по месяцам:</h4>
        <pre>${JSON.stringify(monthlyShares, null, 2)}</pre>
        <h4>Изменения (абсолютные и процентные):</h4>
        <pre>${JSON.stringify(changes, null, 2)}</pre>
    `;
}