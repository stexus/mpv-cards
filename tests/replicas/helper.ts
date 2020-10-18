export const sendreq = (action: string, params: {[key: string]: unknown}): unknown => { 
  return [action, params];
}
