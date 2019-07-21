declare module "chrome-dompath" {
    function _xPathIndex(node: Element): Number;
}
export declare const getXPathSelector: (element: Element) => string;
export declare const getClassChainSelector: (element: Element) => string;
export declare const parseDomFromString: (xmlString: string) => Document;
export declare const getElementAttributesMap: (element: Element) => {[attrName: string]: any};