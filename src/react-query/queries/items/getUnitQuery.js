import { httpService } from '@modules/http/http.service';

export const getUnitQuery = async (organization, displayAlert) => {
  try {
    const response = await httpService.makeRequest(
      'get',
      `${window.env.API_URL}shipment/unit_of_measure/?organization_uuid=${organization}`,
    );
    return response.data;
  } catch (error) {
    displayAlert('error', "Couldn't load unit of measurements due to some error!");
    return [];
  }
};
