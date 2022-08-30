import {
  registeredBanner, //"0 0 182 135" size 185
  receivedBanner, //"-20 0 300 135" size 300
  wetworkBanner, //"-20 0 300 150" size 295
  resultReadyBanner, //"-20 0 300 150" size 295
  qualityControlBanner, //"-20 0 300 125" size 295
  rejectedQCBanner
} from "@debionetwork/ui-icons"


export const PAYMENT_STATUS_DETAIL = Object.freeze({
  UNPAID: "#FAAD15",
  PAID: "#52C41B",
  CANCELLED: "#F5222D",
  REFUNDED: "#F006CB",
  FULFILLED: "#5640A5"
})

export const ORDER_STATUS_DETAIL = Object.freeze({
  REGISTERED: {
    name: "Registered",
    color: "#52C41B",
    detail: "Your request has been registered. You may send your sample to selected lab.",
    banner: registeredBanner,
    bannerSize: "185",
    viewBox: "-10 -13 182 182",
    e1: 2
  },

  ARRIVED: {
    name: "Received by Lab",
    color: "#6F4CEC",
    detail: "Your chosen lab has received and confirmed your specimen. The lab will soon process your order.",
    banner: receivedBanner,
    bannerSize: "300",
    viewBox: "-18 -20 295 295",
    e1: 3
  },

  QUALITYCONTROLLED: {
    name: "Quality Controlled",
    color: "#FAAD15",
    detail: "Your specimen is now being examined by the lab to see if it is sufficient enough to be analyzed in the next phase. The lab will perform several procedures such as examine the visual of your specimen, do extraction and amplification of your DNA.",
    banner: qualityControlBanner,
    bannerSize: 295,
    viewBox: "-18 -15 275 275",
    e1: 4
  },

  REJECTED: (amount) => {
    const detail = `Your sample has failed quality control. Your service fee of ${amount} will be refunded to your account.`
    return {
      name: "Rejected",
      color: "#F5222D",
      detail,
      banner: rejectedQCBanner,
      bannerSize: 295,
      viewBox: "-15 -5 260 260",
      e1: 4
    }
  },

  WETWORK: {
    name: "Analyzed",
    color: "#F006CB",
    detail: "The lab is now analyzing your specimen.",
    banner: wetworkBanner,
    bannerSize: 295,
    viewBox: "-15 -5 285 285",
    e1: 5
  },

  RESULTREADY: {
    name: "Result Ready",
    color: "#5640A5",
    detail: "Thank you for your patience. Your order has been fulfilled. You can click on this button below to see your result.",
    banner: resultReadyBanner,
    bannerSize: 295,
    viewBox: "-5 -5 295 295",
    e1: 6
  }
})

export const STAKE_STATUS_DETAIL = Object.freeze({
  OPEN: {
    display: "Staked",
    color: "#F006CB"
  },
  CLAIMED: {
    display: "Service Available",
    color: "#5640A5"
  },
  PROCESSED: {
    display: "Request Test",
    color: "#4CBB65"
  },
  WAITINGFORUNSTAKED: {
    display: "Waiting For Unstaked",
    color: "#FAAD15"
  },
  UNSTAKED: {
    display: "Unstaked",
    color: "#E32319"
  }
})
