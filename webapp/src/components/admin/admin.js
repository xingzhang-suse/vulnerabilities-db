import { renderComponent } from '../../infra/core/renderer.js';
import { HttpClient } from '../../infra/core/http-client.js';

export class Admin {

  client = new HttpClient('');

  constructor() {
    this.templateUrl = './admin.html';
  }

  async render() {

    const uploadData = (event) => {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.addEventListener('load', (event) => {
        const dataURL = event.target.result;
        this.client.post('vulnerabilities', JSON.parse(dataURL)).then(data => {
        })
      });

      reader.readAsText(file);
    };

    const eventListenerOptions = [
      {
        eventType: 'change',
        eventElement: 'import-file',
        eventFunc: uploadData.bind(this)
      }
    ];

    return renderComponent(this.templateUrl, eventListenerOptions);
  }

  init(){}
}
