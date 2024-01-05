const axios = require("axios");
const logger = require("../../../services/logger");

module.exports = async ({ payload, accessToken }) => {
  try {
    const {
      availabilitySyncURL,
      availabilitySyncPayload,
      syncOrderURL,
      syncOrderPayload,
      id,
    } = payload;

    if (
      !availabilitySyncPayload ||
      !syncOrderPayload ||
      !availabilitySyncURL ||
      !syncOrderURL
    )
      return "payload data incompleted!";

    logger.info("ENTRA SCRIPT SYNC ORDER");

    const { header, token } = accessToken;

    const axiosInstance = axios.create({
      headers: { [header]: token },
    });

    const today = new Date();
    const nextDay = new Date();
    nextDay.setDate(nextDay.getDate() + 1);
    const bodyAvailability = JSON.parse(
      JSON.stringify(availabilitySyncPayload)
    );

    logger.info(
      `Schedule dates: ${JSON.stringify({
        end: nextDay.toISOString(),
        start: today.toISOString(),
      })}`
    );

    bodyAvailability.collections[0].order_sections[0].destination.schedule = {
      end: nextDay.toISOString(),
      start: today.toISOString(),
    };

    const responseAvailability = await axiosInstance.post(
      availabilitySyncURL,
      bodyAvailability
    );

    logger.info({
      message: `Response axios availability sync: ${JSON.stringify(
        responseAvailability.data
      )}`,
    });

    const { data } = responseAvailability;
    let timeSlot = null;
    if (
      data.data.collections.length &&
      data.data.collections[0]?.order_sections[0]?.time_slots.length
    ) {
      timeSlot = data.data.collections[0]?.order_sections[0]?.time_slots[0];
    }
    logger.info(`Time slot selected ${JSON.stringify(timeSlot)}`);

    if (!timeSlot) {
      throw new error("Time slot not found");
    }

    const { collections } = syncOrderPayload;
    const collection = JSON.parse(JSON.stringify(collections[0]));
    collection.order_sections[0].time_slots = [timeSlot];
    const customerReference = `vtexStressTest-${id}`;
    logger.info(`Customer reference: ${customerReference}`);
    collection.header.oms.customer_reference = customerReference;
    const bodyToSend = {
      ...syncOrderPayload,
      collections: [collection],
    };

    const responseSyncOrder = await axiosInstance.post(
      syncOrderURL,
      bodyToSend
    );

    logger.info({
      message: `Response axios sync order: ${JSON.stringify(
        responseSyncOrder.data
      )}`,
    });

    return responseSyncOrder.data;
  } catch (error) {
    logger.error(
      `Error script syncOrder: ${JSON.stringify(
        error?.response?.data || error.message
      )}`
    );
  }
};
