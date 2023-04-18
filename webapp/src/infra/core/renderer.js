
/*
function name: renderComponent
parameter: templateUrl (String)
           eventListenerOptions (Array<Object>, ref: parameter setting below)
              const eventListenerOptions = [
                {
                  eventType: 'click',
                  eventElement: 'import-btn',
                  eventFunc: uploadData
                }
              ];
*/
export async function renderComponent(templateUrl, eventListenerOptions) {
  const html = await fetch(templateUrl).then(res => res.text());
  const container = document.createElement('div');
  return renderDynamicElement(html, container, eventListenerOptions);
}

export function renderDynamicElement(htmlText, container, eventListenerOptions) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlText, 'text/html');
  if (Array.isArray(eventListenerOptions)) {
    eventListenerOptions.forEach(eventListenerOption => {
      doc.getElementById(eventListenerOption.eventElement).addEventListener(eventListenerOption.eventType, eventListenerOption.eventFunc);
    });
  }
  while(doc.body.firstChild) {
    container.appendChild(doc.body.firstChild);
  }
  return container;
}
