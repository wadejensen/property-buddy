export class GeoUtils {
    private static instance: GeoUtils = new GeoUtils()
    
    constructor(){}

    /**
     * Recursively search 
     * @param resultsAcc 
     * @param searchArea 
     * @param performSearch 
     * @param searchIsTooCoarse 
     */
    public static async RecurseSearch(resultsAcc: [any],
                                      searchArea: Rectangle, 
                                      performSearch: (searchArea: Rectangle) => Promise<[any]>, 
                                      searchIsTooCoarse: (results: [any]) => Boolean): Promise<[any]> {
        let result = await performSearch(searchArea)
        if (searchIsTooCoarse(result)) {
            let emptyResult: [any] = [{}]
            let quadrants: [Rectangle] = searchArea.getQuadrants() 
            return quadrants
                .map(async area => await this.RecurseSearch(emptyResult, area, performSearch, searchIsTooCoarse))
                .reduce( async (r1, r2) => <[any]> (await r1).concat(await r2))
        }
        else return <[any]> result 
    }
}

export class Rectangle {
    xmin: number
    ymax: number
    xmax: number
    ymin: number    

    constructor(x1: number, y1: number, x2: number, y2: number) {
        this.xmin = Math.min(x1,x2)
        this.xmax = Math.max(x1,x2)
        this.ymin = Math.min(y1,y2)
        this.ymax = Math.max(y1,y2)
    }

    /**
     * Get the nth quadrant of an existing Rectangle as a new Rectangle
     * @param n 
     * 
     * (xmin, ymax)               ((xmin + xmax)/2, ymax)              (xmax, ymax)
     *       ----------------------------------------------------------------
     *       |                               |                              |
     *       |                               |                              |
     *       |                               |                              |
     *       |                               |                              |
     *       |              1                |             2                |
     *       |                               |                              |
     *       |                               |                              |
     * ((xmin, (ymin + ymax)/2)              |                  ((xmax, (ymin + ymax)/2)
     *       |-------------------------------|------------------------------|
     *       |               ((xmin + xmax)/2, (ymin + ymax)/2)             |
     *       |                               |                              |
     *       |                               |                              |
     *       |                               |                              |
     *       |              3                |              4               |
     *       |                               |                              |
     *       |                               |                              |
     *       |                               |                              |
     *       |                               |                              |
     *       ----------------------------------------------------------------
     * (xmin, ymin)               ((xmin + xmax)/2, ymin)              (xmax, ymin)
     */
    public getQuadrants(): [Rectangle] {
        let quad1 = new Rectangle(this.xmin, this.ymax, (this.xmin + this.xmax)/2,(this.ymin + this.ymax)/2)
        let quad2 = new Rectangle((this.xmin + this.xmax)/2, this.ymax, this.xmax, (this.ymin + this.ymax)/2)
        let quad3 = new Rectangle(this.xmin, (this.ymin + this.ymax)/2, (this.xmin + this.xmax)/2, this.ymin)
        let quad4 = new Rectangle((this.xmin + this.xmax)/2, (this.ymin + this.ymax)/2, this.xmax, this.ymin)
        return [quad1, quad2, quad3, quad4]
    }
}