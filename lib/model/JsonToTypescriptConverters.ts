import {JsonConverter, JsonCustomConvert} from "json2typescript"

@JsonConverter
export class NumberToString implements JsonCustomConvert<String> {
    serialize(str: string): number {
        return parseInt(str)
    }
    deserialize(num: number): string {
        return num.toString()
    } 
}

@JsonConverter
export class StringToNumber implements JsonCustomConvert<Number> {
    serialize(num: number): string {
        return num.toString()
    }
    deserialize(str: string): number {
        return parseInt(str)
    } 
}