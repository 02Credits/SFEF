export function loop(value: number, lowerBound: number, upperBound: number) {
    if (value > upperBound)
    {
        return lowerBound;
    }
    else if (value < lowerBound)
    {
        return upperBound;
    }
    else
    {
        return value;
    }
}
