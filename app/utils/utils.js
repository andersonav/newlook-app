export function formatNumber(number) {
    // Formata o número para duas casas decimais
    const formattedNumber = parseFloat(number).toFixed(2);

    // Separa a parte inteira da parte decimal
    const [integerPart, decimalPart] = formattedNumber.split('.');

    // Aplica a formatação de milhares com pontos
    const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    // Retorna o número formatado no formato brasileiro
    return `${formattedIntegerPart},${decimalPart}`;
}
