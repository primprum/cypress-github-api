class PageObject {
  checkResponseStatus(response, expectedStatusCode) {
    if (response.status !== expectedStatusCode) {
      throw new Error(`Expected a ${expectedStatusCode} status code but got ${response.status} instead!`);
    }
  }
}

export default new PageObject();
