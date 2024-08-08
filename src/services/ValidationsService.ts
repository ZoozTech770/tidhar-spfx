
export default class validationsService {
    public validateNumber(value: string): string {
        if (isNaN(+value)) {
                return 'מספרים בלבד';
              }
              return '';
      }
}
export const ValidationsService = new validationsService()
