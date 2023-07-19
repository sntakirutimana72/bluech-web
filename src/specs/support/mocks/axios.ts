import { Axios } from '../../../helpers/requests';

export default function mocker(attribute: 'get' | 'post' | 'delete', response: { [key: string]: any }) {
  const spyware = jest.spyOn(Axios, attribute);
  spyware.mockResolvedValue(response);
  return spyware;
}
