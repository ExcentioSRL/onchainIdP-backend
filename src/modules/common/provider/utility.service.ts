import { v4 as uuidv4 } from 'uuid';

export class UtilityService { 

    public static generateUuid(): string {
        return  uuidv4();
    }
    public static mapper<T>(input:{[index:string]:any} & any,dest:{[index:string]:any}){
        Object.keys(input).forEach((key)=>{dest[key]=input[key]})
        return dest as T;
    }
}
