

const utilsFormatDate = class utilsFormatDate {
    static DD_MM_YYYY(data: string): string | null {
        if (!data) return null;
        const match = data.match(/(\d{4})\/(\d{2})\/(\d{2})/);
        if (!match) return null;
        const [, year, month, day] = match;
        const date = new Date(Number(year), Number(month) - 1, Number(day));
        if (
            isNaN(date.getTime()) ||
            date.getFullYear() !== Number(year) ||
            date.getMonth() + 1 !== Number(month) ||
            date.getDate() !== Number(day)
        ) {
            return null;
        }
        return `${day}/${month}/${year}`;
    }

    static YYYY_MM_DD(dateString: string): string {
        const [day, month, year] = dateString.split("/");
        return `${year}-${month}-${day}`;
    }

    static YYYY_MM_DD_BY_DD_MM_YYYY(dateString: string): string {
        const [year, month, day] = dateString.split("/");
        return `${year}-${month}-${day}`;
    }
}

export default utilsFormatDate;