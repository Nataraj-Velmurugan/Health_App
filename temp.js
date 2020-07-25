'use strict';

const Alexa = require('ask-sdk-core');
const https = require('https');
const i18n = require('i18next');
const sprintf = require('i18next-sprintf-postprocessor');
const ProfanityFilter = require('./profanity');

const hiData = {
  translation: {
    welcomeMessage: 'https://macdealexa.co.in/audio/translatesounds/hiwelcomehindimessage1.mp3',
    cancelMessage: "https://macdealexa.co.in/audio/translatesounds/hihindicalcelmeesagess1.mp3",
    helpMessage: `आप कह सकते हैं कि कुछ टॉम वापस दोहराएंगे.`,
    exitSkillMessage: `टॉकिंग टॉम का उपयोग करने के लिए धन्यवाद`,
    SKILL_NAME: 'talking टॉम',
    saySomething: 'https://macdealexa.co.in/audio/translatesounds/hisaysomethingtome1.mp3',
    bye: 'https://macdealexa.co.in/audio/translatesounds/hibye11.mp3',
    profanityFilterResponse: 'https://macdealexa.co.in/audio/translatesounds/hiprofanityresponsetalkingtom1.mp3'
  }
};

const enIN = {
  translation: {
    welcomeMessage: 'https://macdealexa.co.in/audio/translatesounds/endemo11.mp3',
    exitSkillMessage: `Thank you for using Talking Tom, catch you soon! `,
    helpMessage: `You can say something to me, tom will repeat back.`,
    cancelMessage: "https://macdealexa.co.in/audio/translatesounds/encalcelmeesagess1.mp3",
    SKILL_NAME: 'Talking Tom',
    saySomething: 'https://macdealexa.co.in/audio/translatesounds/enJSDBVhdsbjvbsd1.mp3',
    bye: 'https://macdealexa.co.in/audio/translatesounds/enbyemoha1.mp3',
    profanityFilterResponse: 'https://macdealexa.co.in/audio/translatesounds/enohnotalkingtom11.mp3'

  },
};

const enUK = {
  translation: {
    welcomeMessage: 'https://macdealexa.co.in/audio/translatesounds/endemo11.mp3',
    exitSkillMessage: `Thank you for using Talking Tom, catch you soon! `,
    helpMessage: `You can say something to me, tom will repeat back.`,
    cancelMessage: "https://macdealexa.co.in/audio/translatesounds/encalcelmeesagess1.mp3",
    SKILL_NAME: 'Talking Tom',
    saySomething: 'https://macdealexa.co.in/audio/translatesounds/enJSDBVhdsbjvbsd1.mp3',
    bye: 'https://macdealexa.co.in/audio/translatesounds/enbyemoha1.mp3',
    profanityFilterResponse: 'https://macdealexa.co.in/audio/translatesounds/enohnotalkingtom11.mp3'
  },
};

const enUS = {
  translation: {
    welcomeMessage: 'https://macdealexa.co.in/audio/translatesounds/endemo11.mp3',
    exitSkillMessage: `Thank you for using Talking Tom, catch you soon! `,
    helpMessage: `You can say something to me, tom will repeat back.`,
    cancelMessage: "https://macdealexa.co.in/audio/translatesounds/encalcelmeesagess1.mp3",
    SKILL_NAME: 'Talking Tom',
    saySomething: 'https://macdealexa.co.in/audio/translatesounds/enJSDBVhdsbjvbsd1.mp3',
    bye: 'https://macdealexa.co.in/audio/translatesounds/enbyemoha1.mp3',
    profanityFilterResponse: 'https://macdealexa.co.in/audio/translatesounds/enohnotalkingtom11.mp3'
  },
};

const enGB = {
  translation: {
    welcomeMessage: 'https://macdealexa.co.in/audio/translatesounds/endemo11.mp3',
    exitSkillMessage: `Thank you for using Talking Tom, catch you soon! `,
    helpMessage: `You can say something to me, tom will repeat back.`,
    cancelMessage: "https://macdealexa.co.in/audio/translatesounds/encalcelmeesagess1.mp3",
    SKILL_NAME: 'Talking Tom',
    saySomething: 'https://macdealexa.co.in/audio/translatesounds/enJSDBVhdsbjvbsd1.mp3',
    bye: 'https://macdealexa.co.in/audio/translatesounds/enbyemoha1.mp3',
    profanityFilterResponse: 'https://macdealexa.co.in/audio/translatesounds/enohnotalkingtom11.mp3'
  },
};

const enCA = {
  translation: {
    welcomeMessage: 'https://macdealexa.co.in/audio/translatesounds/endemo11.mp3',
    exitSkillMessage: `Thank you for using Talking Tom, catch you soon! `,
    helpMessage: `You can say something to me, tom will repeat back.`,
    cancelMessage: "https://macdealexa.co.in/audio/translatesounds/encalcelmeesagess1.mp3",
    SKILL_NAME: 'Talking Tom',
    saySomething: 'https://macdealexa.co.in/audio/translatesounds/enJSDBVhdsbjvbsd1.mp3',
    bye: 'https://macdealexa.co.in/audio/translatesounds/enbyemoha1.mp3',
    profanityFilterResponse: 'https://macdealexa.co.in/audio/translatesounds/enohnotalkingtom11.mp3'
  },
};

const enAU = {
  translation: {
    welcomeMessage: 'https://macdealexa.co.in/audio/translatesounds/endemo11.mp3',
    exitSkillMessage: `Thank you for using Talking Tom, catch you soon! `,
    helpMessage: `You can say something to me, tom will repeat back.`,
    cancelMessage: "https://macdealexa.co.in/audio/translatesounds/encalcelmeesagess1.mp3",
    SKILL_NAME: 'Talking Tom',
    saySomething: 'https://macdealexa.co.in/audio/translatesounds/enJSDBVhdsbjvbsd1.mp3',
    bye: 'https://macdealexa.co.in/audio/translatesounds/enbyemoha1.mp3',
    profanityFilterResponse: 'https://macdealexa.co.in/audio/translatesounds/enohnotalkingtom11.mp3'
  },
};


const languageStrings = {
  'hi-IN': hiData,
  'en-US': enUS,
  'en-IN': enIN,
  'en-UK': enUK,
  'en-GB': enGB,
  'en-CA': enCA,
  'en-AU': enAU
};

const audioUrl = "https://macdealexa.co.in/audio/translatesounds/hi789654rmohan1.mp3";
const videoUrl = "https://macdealexa.co.in/audio/translatesounds/hi789654rmohan1.mp4"


const RequestLog = {
  process(handlerInput) {
    console.log("REQUEST ENVELOPE = " + JSON.stringify(handlerInput.requestEnvelope));
    return;

  }
};

const ResponseLog = {
  process(handlerInput) {
    console.log(`RESPONSE = ${JSON.stringify(handlerInput.responseBuilder.getResponse())}`);
  },
};

function SupportAPL(handlerInput){
  const supportedInterfaces = handlerInput.requestEnvelope.context.System.device.supportedInterfaces;
  const aplInterface = supportedInterfaces['Alexa.Presentation.APL'];
  return aplInterface !== null & aplInterface !== undefined;
}

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === `LaunchRequest`;
  },
  handle(handlerInput) {
    const response = handlerInput.responseBuilder;
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    var word = "mohan";

    console.log(ProfanityFilter(word));

    return response
      .speak('<audio src="' + requestAttributes.t('welcomeMessage') + '"/>')
      .reprompt('<audio src="' + requestAttributes.t('welcomeMessage') + '"/>')
      .getResponse();
  },
};

const Talk = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    console.log("Inside language Handler");
    console.log(JSON.stringify(request));
    return request.type === "IntentRequest" && request.intent.name === "Talk";
  },

  async handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    var request = handlerInput.requestEnvelope.request,
      language,
      attributes = handlerInput.attributesManager.getSessionAttributes();

    const requestid = request.requestId;
    const usertalk = request.intent.slots.usertalk.value;

    if (handlerInput.requestEnvelope.request.locale === 'hi-IN') {
      language = 'hi';
      if (ProfanityFilter(usertalk)) {
        return handlerInput.responseBuilder
          .speak('<audio src="' + requestAttributes.t('profanityFilterResponse') + '"/>')
          .reprompt('<audio src="' + requestAttributes.t('saySomething') + '"/>')
          .getResponse();
      }
    }
    else {
      language = 'en';
      if (ProfanityFilter(usertalk)) {
        return handlerInput.responseBuilder
          .speak('<audio src="' + requestAttributes.t('profanityFilterResponse') + '"/>')
          .reprompt('<audio src="' + requestAttributes.t('saySomething') + '"/>')
          .getResponse();
      }
    }

    if (usertalk === "help" && handlerInput.requestEnvelope.request.locale !== 'hi-IN') {
      return handlerInput.responseBuilder
        .speak(requestAttributes.t('helpMessage'))
        .reprompt(requestAttributes.t('helpMessage'))
        .getResponse();

    } else if (handlerInput.requestEnvelope.request.locale !== 'hi-IN' && usertalk === "cancel" || usertalk === "exit") {
       return handlerInput.responseBuilder
        .speak('<audio src="' + requestAttributes.t('cancelMessage') + '"/>')
        .getResponse();
    }

    let response = await httpGet(language, encodeURIComponent(usertalk), requestid);

    if(SupportAPL(handlerInput)) {
      response.url = videoUrl
      attributes.lastspeech = response.url;
      return handlerInput.responseBuilder
      .speak('<audio src="' + response.url + '"/> <break time="0.5s"/> ')
      .addDirective({
        type: 'Alexa.Presentation.APL.RenderDocument',
        document: require('./apl/layouts/talkingTom.json'),
        datasources:{
          "data": {
            'url': videoUrl
          }
        },
        token: "VideoPlayerToken"
      })
      .reprompt('<audio src="' + requestAttributes.t('saySomething') + '"/>')
      .getResponse();
    } else {
      response.url = audioUrl
      attributes.lastspeech = response.url;
    }
    
    return handlerInput.responseBuilder
      .speak('<audio src="' + response.url + '"/> <break time="0.5s"/> ')
      .reprompt('<audio src="' + requestAttributes.t('saySomething') + '"/>')
      .getResponse();
  },
};

const profanityFilterIntentHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    console.log("Inside profanityFilterIntent Handler");
    console.log(JSON.stringify(request));
    return request.type === "IntentRequest" && request.intent.name === "profanityFilterIntent";
  },
  async handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();

    return handlerInput.responseBuilder
      .speak('<audio src="' + requestAttributes.t('profanityFilterResponse') + '"/>')
      .reprompt('<audio src="' + requestAttributes.t('saySomething') + '"/>')
      .getResponse();

  },
};

const End = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    console.log("Inside language Handler");
    console.log(JSON.stringify(request));
    return request.type === "IntentRequest" && request.intent.name === "End";
  },

  async handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    console.log("Inside End - Handler");

    return handlerInput.responseBuilder
      .speak('<audio src="' + requestAttributes.t('cancelMessage') + '"/>')
      .getResponse();

  },
};

const HelpHandler = {
  canHandle(handlerInput) {
    console.log("Inside HelpHandler");
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest' &&
      request.intent.name === 'AMAZON.HelpHandler';
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    console.log("Inside HelpHandler - handle");

    const response = handlerInput.responseBuilder;

    return response
      .speak(requestAttributes.t('helpMessage'))
      .reprompt(requestAttributes.t('helpMessage'))
      .getResponse();
  },
};


const ExitHandler = {
  canHandle(handlerInput) {
    console.log("Inside ExitHandler");
    const request = handlerInput.requestEnvelope.request;

    return request.type === `IntentRequest` && (
      request.intent.name === 'AMAZON.StopIntent' ||
      request.intent.name === 'AMAZON.PauseIntent' ||
      request.intent.name === 'AMAZON.CancelIntent'
    );
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();

    return handlerInput.responseBuilder
      .speak('<audio src="' + requestAttributes.t('cancelMessage') + '"/>')
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    console.log("Inside SessionEndedRequestHandler");
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${JSON.stringify(handlerInput.requestEnvelope)}`);
    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    console.log("Inside ErrorHandler");
    return true;
  },
  handle(handlerInput, error) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();

    console.log("Inside ErrorHandler - handle");
    console.log(`Error handled: ${JSON.stringify(error)}`);
    console.log(`Handler Input: ${JSON.stringify(handlerInput)}`);

    const response = handlerInput.responseBuilder;

    return response
      .speak(requestAttributes.t('helpMessage'))
      .reprompt(requestAttributes.t('helpMessage'))
      .getResponse();
  },
};


function httpGet(languagecode, texttotranslate, requestid) {
  return new Promise(((resolve, reject) => {
    var options = {
      host: 'macdealexa.co.in',
      port: 443,
      path: '/talkingtomvideo?lang=' + languagecode + '&text=' + texttotranslate + '&requestid=' + requestid,
      method: 'GET',
    };

    const request = https.request(options, (response) => {
      response.setEncoding('utf8');
      let returnData = '';

      response.on('data', (chunk) => {
        returnData += chunk;
      });

      response.on('end', () => {
        resolve(JSON.parse(returnData));
      });

      response.on('error', (error) => {
        reject(error);
      });
    });
    request.end();
  }));
}

const LocalizationInterceptor = {
  process(handlerInput) {
    const localizationClient = i18n.use(sprintf).init({
      lng: handlerInput.requestEnvelope.request.locale,
      resources: languageStrings,
    });
    localizationClient.localize = function localize() {
      const args = arguments;
      const values = [];
      for (let i = 1; i < args.length; i += 1) {
        values.push(args[i]);
      }
      const value = i18n.t(args[0], {
        returnObjects: true,
        postProcess: 'sprintf',
        sprintf: values,
      });

      if (Array.isArray(value)) {
        return value[Math.floor(Math.random() * value.length)];
      }
      return value;
    };
    const attributes = handlerInput.attributesManager.getRequestAttributes();
    attributes.t = function translate(...args) {
      return localizationClient.localize(...args);
    };
  },
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    Talk,
    profanityFilterIntentHandler,
    End,
    HelpHandler,
    ExitHandler,
    SessionEndedRequestHandler
  )
  .addRequestInterceptors(LocalizationInterceptor)
  .addErrorHandlers(ErrorHandler)
  .addRequestInterceptors(RequestLog)
  .addResponseInterceptors(ResponseLog)
  .lambda();