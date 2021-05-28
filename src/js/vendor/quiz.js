const quizData = [
  {
    number: 1,
    title: "Какой тип кроссовок рассматриваете?",
    answer_alias: "type",
    answers: [
      {
        answer_title: "кеды",
        type: "checkbox",
      },
      {
        answer_title: "кеды",
        type: "checkbox",
      },
      {
        answer_title: "кеды",
        type: "checkbox",
      },
      {
        answer_title: "кеды",
        type: "checkbox",
      },
      {
        answer_title: "кеды",
        type: "checkbox",
      },
      {
        answer_title: "кеды",
        type: "checkbox",
      },
    ],
  },
  {
    number: 2,
    title: "Какой размер вам подойдет?",
    answer_alias: "size",
    answers: [
      {
        answer_title: "менее 36",
        type: "checkbox",
      },
      {
        answer_title: "36-38",
        type: "checkbox",
      },
      {
        answer_title: "39-41",
        type: "checkbox",
      },
      {
        answer_title: "42-44",
        type: "checkbox",
      },
      {
        answer_title: "45 и больше",
        type: "checkbox",
      },
    ],
  },
  {
    number: 3,
    title: "Уточните какие-либо моменты",
    answer_alias: "message",
    answers: [
      {
        answer_title: "Введите сообщение",
        type: "textarea",
      },
    ],
  },
  // {
  //   number: 4,
  //   title: "Уточните какие-либо моменты",
  //   answer_alias: "phone",
  //   answers: [
  //     {
  //       answer_title: "Введите телефон",
  //       type: "text",
  //     },
  //   ],
  // },
];

const quizTemplate = (data = [], dataLength = 0, options) => {
  const { number, title } = data;
  const { nextBtnText } = options;
  const answers = data.answers.map((item) => {
    if (item.type === "checkbox") {
      return `
      <li class="quiz-question__item">
      <img src="img/cross-photo.jpg" alt="">
      <label class="custom-checkbox quiz-question__label">
         <input type="${
           item.type
         }" class="custom-checkbox__field" data-valid="false" class="quiz-question__answer"
         name="${data.answer_alia}" ${
        item.type == "text" ? 'placeholder="Введите ваш вариант"' : ""
      } value="${item.type !== "text" ? item.answer_title : ""}">
         <span class="custom-checkbox__content">${item.answer_title}</span>
      </label>
      </li>
		`;
    } else if (item.type === "textarea") {
      return `
      <label class="quiz-question__label">
        <textarea placeholder="${item.answer_title}" class="quiz-question__message"></textarea>
      </label>
    `;
    } else {
      return `
			<label class="quiz-question__label">
				<input type="${
          item.type
        }" data-valid="false" class="quiz-question__answer" name="${
        data.answer_alias
      }" ${
        item.type == "text" ? 'placeholder="Введите ваш вариант"' : ""
      } value="${item.type !== "text" ? item.answer_title : ""}">
				<span>${item.answer_title}</span>
			</label>
		`;
    }
  });

  return `
		<div class="quiz-questions">
      <div class="quiz-question">
				<h3 class="quiz-question__title">${title}</h3>
				<ul class="quiz-question__answers list-reset">
					${answers.join("")}
				</ul>
        <div class="quiz-bottom">
          <div class="quiz__questions">${number} из ${dataLength}</div>
          <button type="button" class="btn btn-reset btn--thirdly quiz-question__btn" data-next-btn>${nextBtnText}</button>
        </div>
			</div>
		</div>
	`;
};

class Quiz {
  constructor(selector, data, options) {
    this.$el = document.querySelector(selector);
    this.options = options;
    this.data = data;
    this.counter = 0;
    this.dataLength = this.data.length;
    this.resultArray = [];
    this.tmp = {};
    this.init();
    this.events();
  }

  init() {
    console.log("init!");
    this.$el.innerHTML = quizTemplate(
      this.data[this.counter],
      this.dataLength,
      this.options
    );
  }

  nextQuestion() {
    console.log("next question!");

    if (this.valid()) {
      if (this.counter + 1 < this.dataLength) {
        this.counter++;
        this.$el.innerHTML = quizTemplate(
          this.data[this.counter],
          this.dataLength,
          this.options
        );

        if (this.counter + 1 == this.dataLength) {
          // this.$el
          //   .querySelector(".quiz-bottom")
          //   .insertAdjacentHTML(
          //     "beforeend",
          //     `<button type="button" data-send>${this.options.sendBtnText}</button>`
          //   );
          // this.$el.querySelector("[data-next-btn]").remove();
        }
      } else {
        console.log("А все! конец!");
        document.querySelector(".quiz-questions").style.display = "none";
        document.querySelector(".asd").style.display = "block";
      }
    } else {
      console.log("Не валидно!");
    }
  }

  events() {
    console.log("events!");
    this.$el.addEventListener("click", (e) => {
      if (e.target == document.querySelector("[data-next-btn]")) {
        this.addToSend();
        this.nextQuestion();
      }

      if (e.target == document.querySelector("[data-send]")) {
        this.send();
      }
    });

    this.$el.addEventListener("change", (e) => {
      if (e.target.tagName == "INPUT") {
        if (e.target.type !== "checkbox" && e.target.type !== "radio") {
          let elements = this.$el.querySelectorAll("input");

          elements.forEach((el) => {
            el.checked = false;
          });
        }
        this.tmp = this.serialize(this.$el);
      }
    });
  }

  valid() {
    let isValid = false;

    let textarea = this.$el.querySelector("textarea");

    if (textarea) {
      if (textarea.value.length > 0) {
        isValid = true;
        return isValid;
      }
    }

    let elements = this.$el.querySelectorAll("input");
    elements.forEach((el) => {
      switch (el.nodeName) {
        case "INPUT":
          switch (el.type) {
            case "text":
              if (el.value) {
                isValid = true;
              } else {
                el.classList.add("error");
              }
            case "checkbox":
              if (el.checked) {
                isValid = true;
              } else {
                el.classList.add("error");
              }
            case "radio":
              if (el.checked) {
                isValid = true;
              } else {
                el.classList.add("error");
              }
          }
      }
    });

    return isValid;
  }

  addToSend() {
    this.resultArray.push(this.tmp);
  }

  send() {
    if (this.valid()) {
      const formData = new FormData();

      for (let item of this.resultArray) {
        for (let obj in item) {
          formData.append(obj, item[obj].substring(0, item[obj].length - 1));
        }
      }

      const response = fetch("mail.php", {
        method: "POST",
        body: formData,
      });
    }
  }

  serialize(form) {
    let field,
      s = {};
    let valueString = "";
    if (typeof form == "object" && form.nodeName == "FORM") {
      let len = form.elements.length;
      for (let i = 0; i < len; i++) {
        field = form.elements[i];

        if (
          field.name &&
          !field.disabled &&
          field.type != "file" &&
          field.type != "reset" &&
          field.type != "submit" &&
          field.type != "button"
        ) {
          if (field.type == "select-multiple") {
            for (j = form.elements[i].options.length - 1; j >= 0; j--) {
              if (field.options[j].selected)
                s[s.length] =
                  encodeURIComponent(field.name) +
                  "=" +
                  encodeURIComponent(field.options[j].value);
            }
          } else if (
            (field.type != "checkbox" &&
              field.type != "radio" &&
              field.value) ||
            field.checked
          ) {
            valueString += field.value + ",";

            s[field.name] = valueString;
          }
        }
      }
    }
    return s;
  }
}

window.quiz = new Quiz(".quiz-form .quiz-questions", quizData, {
  nextBtnText: "Следующий шаг",
  sendBtnText: "Отправить",
});
