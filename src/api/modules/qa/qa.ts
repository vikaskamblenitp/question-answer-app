class QA {
  async getQuestionAnswers() {
    await new Promise((resolve) => { resolve("Answer")});
  }
};

export const qa = new QA();