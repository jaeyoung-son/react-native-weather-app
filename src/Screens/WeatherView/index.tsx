import React, {useEffect, useState} from 'react';
import {FlatList, Alert} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import styled from 'styled-components/native';

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: #eee;
`;

const WEatherContainer = styled.FlatList``;

const LoadingView = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Loading = styled.ActivityIndicator`
  margin-bottom: 16px;
`;

const LoadingLabel = styled.Text`
  font-size: 16px;
`;

const WeatherItemContainer = styled.View`
  height: 100%;
  justify-content: center;
  align-items: center;
`;

const Weather = styled.Text`
  margin-bottom: 16px;
  font-size: 24px;
  font-weight: bold;
`;

const Temperature = styled.Text`
  font-size: 16px;
`;

const API_KEY = '5f44768166049ea05040a3b2fb082b52';

interface IWeather {
  temperature?: number;
  weather?: string;
  isLoading: boolean;
}

const WeatherView = () => {
  const [weatherInfo, setWeatherInfo] = useState<IWeather>({
    temperature: undefined,
    weather: undefined,
    isLoading: false,
  });

  const getCurrentWeather = () => {
    setWeatherInfo({
      isLoading: false,
    });

    Geolocation.getCurrentPosition(
      position => {
        console.log(position);
        const {latitude, longitude} = position.coords;

        fetch(
          `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&APPID=${API_KEY}&units=metric`,
        )
          .then(res => {
            console.log(res, '레스 콘솔찍기');
            return res.json();
          })
          .then(json => {
            setWeatherInfo({
              temperature: json.main.temp,
              weather: json.weather[0].main,
              isLoading: true,
            });
          })
          .catch(err => {
            setWeatherInfo({
              isLoading: true,
            });
            showError('날씨 정보를 가져오는데 실패하였습니다.');
          });
      },
      error => {
        setWeatherInfo({
          isLoading: true,
        });
        showError('위치 정보를 가져오는데 실패하였습니다.');
      },
    );
  };
  const showError = (msg: string): void => {
    setTimeout(() => {
      Alert.alert(msg);
    }, 500);
  };

  useEffect(() => {
    getCurrentWeather();
  }, []);

  let data = [];
  const {isLoading, weather, temperature} = weatherInfo;
  if (weather && temperature) {
    data.push(weatherInfo);
  }

  return (
    <Container>
      <WEatherContainer
        onRefresh={() => getCurrentWeather()}
        refreshing={!isLoading}
        data={data}
        keyExtractor={(item, index) => {
          return `Weather-${index}`;
        }}
        ListEmptyComponent={
          <LoadingView>
            <Loading size="large" color="#1976D2" />
            <LoadingLabel>Loading...</LoadingLabel>
          </LoadingView>
        }
        renderItem={({item, index}) => (
          <WeatherItemContainer>
            <Weather>{(item as IWeather).weather}</Weather>
            <Temperature>{(item as IWeather).temperature}</Temperature>
          </WeatherItemContainer>
        )}
        contentContainerStyle={{flex: 1}}></WEatherContainer>
    </Container>
  );
};

export default WeatherView;
