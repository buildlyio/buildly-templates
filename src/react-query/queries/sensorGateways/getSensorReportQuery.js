import { httpService } from '@modules/http/http.service';
import _ from 'lodash';

export const getSensorReportQuery = async (shipmentIds, displayAlert) => {
  try {
    const response = await httpService.makeRequest(
      'get',
      `${window.env.API_URL}sensors/sensor_report/?shipment_id=${shipmentIds}`,
    );
    return response.data;
  } catch (error) {
    displayAlert('error', "Couldn't load sensor reports due to some error!");
    return [];
  }
};
