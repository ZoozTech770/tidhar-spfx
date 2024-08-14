const useDateFormatter = () => {

    const formatDate = (date: Date) => {
        let day: number | string = date.getDate();
        let month: number | string = date.getMonth() + 1;
        const year = date.getFullYear();

        if (day < 10) {
            day = "0" + day
        }
        if (month < 10) {
            month = "0" + month
        }

        return `${day}.${month}.${year}`
    }

    const getHebrewMonth = (month: number) => {
        const months = ["ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני", "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"];
        return months[month];
    }

    return {
        formatDate,
        getHebrewMonth
    }


}



export default useDateFormatter;