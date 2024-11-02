import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const months = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

const getCurrentDate = () => {
  const date = new Date();
  return {
    year: date.getFullYear(),
    month: date.getMonth(),
  };
};

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(getCurrentDate());

  const prevMonth = () => {
    setCurrentDate(prev => {
      const newMonth = prev.month === 0 ? 11 : prev.month - 1;
      const newYear = prev.month === 0 ? prev.year - 1 : prev.year;
      return { year: newYear, month: newMonth };
    });
  };

  const nextMonth = () => {
    setCurrentDate(prev => {
      const newMonth = prev.month === 11 ? 0 : prev.month + 1;
      const newYear = prev.month === 11 ? prev.year + 1 : prev.year;
      return { year: newYear, month: newMonth };
    });
  };

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <Button title="Anterior" onPress={prevMonth} />
        <Text style={styles.headerText}>{`${months[currentDate.month]} ${currentDate.year}`}</Text>
        <Button title="Próximo" onPress={nextMonth} />
      </View>
    );
  };

  const renderDaysOfWeek = () => {
    return (
      <View style={styles.daysOfWeek}>
        {daysOfWeek.map(day => (
          <View key={day} style={styles.day}>
            <Text>{day}</Text>
          </View>
        ))}
      </View>
    );
  };

  const renderDaysOfMonth = () => {
    const firstDayOfMonth = new Date(currentDate.year, currentDate.month, 1).getDay();
    const totalDaysOfMonth = new Date(currentDate.year, currentDate.month + 1, 0).getDate();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<View key={`empty-${i}`} style={styles.day}></View>);
    }

    // Add days of the month
    for (let i = 1; i <= totalDaysOfMonth; i++) {
      days.push(
        <View key={i} style={styles.day}>
          <Text>{i}</Text>
        </View>
      );
    }

    return (
      <View style={styles.daysOfMonth}>
        {days}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderHeader()}
      {renderDaysOfWeek()}
      {renderDaysOfMonth()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 18,
  },
  daysOfWeek: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  day: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 30,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  daysOfMonth: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

export default Calendar;
