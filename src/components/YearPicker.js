/**
 * YearPicker — Scrollable year selection modal.
 *
 * Features:
 *   - Trigger button showing current selection
 *   - Modal overlay with scrollable year list
 *   - Snap-to-item scrolling for precise selection
 *   - Highlight bar indicating current position
 *   - Auto-scrolls to selected year on open
 *   - Accessible with proper labels and roles
 */

import { useState, useMemo, useRef, useCallback, memo } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { useTheme } from '../utils/ThemeContext';
import createStyles from '../styles';

const ITEM_HEIGHT = 44;
const VISIBLE_ITEMS = 5;
const PICKER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;

function YearPicker({ selectedYear, years, onYearChange }) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [open, setOpen] = useState(false);
  const scrollRef = useRef(null);

  const handleOpen = useCallback(() => {
    setOpen(true);
    // Scroll to selected year after modal opens
    setTimeout(() => {
      const index = years.indexOf(selectedYear);
      if (index >= 0 && scrollRef.current) {
        scrollRef.current.scrollTo({
          y: index * ITEM_HEIGHT,
          animated: false,
        });
      }
    }, 50);
  }, [selectedYear, years]);

  const handleSelect = useCallback(
    (year) => {
      onYearChange(year);
      setOpen(false);
    },
    [onYearChange],
  );

  return (
    <>
      {/* Trigger button */}
      <TouchableOpacity
        style={[styles.yearPickerButton, { borderColor: theme.inputBorder }]}
        onPress={handleOpen}
        activeOpacity={0.6}
        accessibilityRole="button"
        accessibilityLabel={`Selected year: ${selectedYear}. Tap to change.`}
      >
        <Text style={[styles.yearPickerButtonText, { color: theme.text }]}>
          {selectedYear}
        </Text>
        <Text style={{ color: theme.textMuted, fontSize: 12 }}>{'\u25BC'}</Text>
      </TouchableOpacity>

      {/* Modal overlay */}
      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <TouchableOpacity
          style={styles.yearPickerOverlay}
          activeOpacity={1}
          onPress={() => setOpen(false)}
          accessibilityLabel="Close year picker"
        >
          <View
            style={[
              styles.yearPickerModal,
              { backgroundColor: theme.surfaceElevated, borderColor: theme.surfaceBorder },
            ]}
            onStartShouldSetResponder={() => true}
          >
            <Text style={[styles.yearPickerTitle, { color: theme.text }]}>
              Select Year
            </Text>

            <View style={[styles.yearPickerList, { height: PICKER_HEIGHT }]}>
              {/* Selection highlight bar */}
              <View
                style={[
                  styles.yearPickerHighlight,
                  {
                    top: ITEM_HEIGHT * Math.floor(VISIBLE_ITEMS / 2),
                    height: ITEM_HEIGHT,
                    backgroundColor: theme.accentBg,
                    borderColor: theme.accentBorder,
                  },
                ]}
              />
              <ScrollView
                ref={scrollRef}
                showsVerticalScrollIndicator={false}
                snapToInterval={ITEM_HEIGHT}
                decelerationRate="fast"
                contentContainerStyle={{
                  paddingVertical: ITEM_HEIGHT * Math.floor(VISIBLE_ITEMS / 2),
                }}
              >
                {years.map((year) => {
                  const isSelected = year === selectedYear;
                  return (
                    <TouchableOpacity
                      key={year}
                      style={[styles.yearPickerItem, { height: ITEM_HEIGHT }]}
                      onPress={() => handleSelect(year)}
                      activeOpacity={0.6}
                      accessibilityRole="button"
                      accessibilityLabel={`Select ${year}`}
                      accessibilityState={{ selected: isSelected }}
                    >
                      <Text
                        style={[
                          styles.yearPickerItemText,
                          { color: isSelected ? theme.accent : theme.text },
                          isSelected && { fontWeight: '700' },
                        ]}
                      >
                        {year}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            <TouchableOpacity
              style={[styles.yearPickerDone, { backgroundColor: theme.accent }]}
              onPress={() => setOpen(false)}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Done selecting year"
            >
              <Text style={styles.yearPickerDoneText}>Done</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

export default memo(YearPicker);
