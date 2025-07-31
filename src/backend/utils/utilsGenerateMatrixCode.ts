export default function utilsGenerateMatrixCode(code: string): string {
    const date = new Date();
    const year = date.getFullYear();

    const randomNumber = Math.floor(Math.random() * 89999999999999) + 10000000000000;
    const randomNumberString = randomNumber.toString().padStart(14, "0");

    const result = `${code}-${randomNumberString}-${year}`;

    return result;

}