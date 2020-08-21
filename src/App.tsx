import React from 'react';
import styled from 'styled-components/native';
import WeatherView from '~/Screens/WeatherView';

const Container = styled.View`
  flex: 1;
  background-color: #eee;
`;

const App = () => {
  return (
    <Container>
      <WeatherView />
    </Container>
  );
};

export default App;
