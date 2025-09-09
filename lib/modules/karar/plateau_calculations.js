import _ from 'lodash';

// Age calculation utilities for K-Ar dating
export class PlateauCalculations {
  
  // Calculate age from isotope ratios
  static calculateAge(measurement, jValue, decayConstants) {
    try {
      
      // Extract isotope ratios and their uncertainties
      // Try multiple possible field names for flexibility
      const ar36_ar39 = parseFloat(measurement.total_36ar_39ar_ratio || measurement.measurement_36ar_39ar_ratio) || 0;
      const ar36_ar39_sigma = parseFloat(measurement.total_36ar_39ar_ratio_sigma || measurement.measurement_36ar_39ar_ratio_sigma) || 0;
      
      // Calculate 40Ar/39Ar ratio from corrected values if available
      let ar40_ar39 = parseFloat(measurement.measurement_40ar_39ar_ratio) || 0;
      let ar40_ar39_sigma = parseFloat(measurement.measurement_40ar_39ar_ratio_sigma) || 0;
      
      // If not available directly, try to calculate from corrected radiogenic and potassium values
      if (ar40_ar39 === 0 && measurement.corrected_40ar_radiogenic && measurement.corrected_39ar_potassium) {
        const rad40 = parseFloat(measurement.corrected_40ar_radiogenic) || 0;
        const k39 = parseFloat(measurement.corrected_39ar_potassium) || 0;
        if (k39 > 0) {
          ar40_ar39 = rad40 / k39;
          // Simple error propagation (this could be more sophisticated)
          const rad40_sigma = parseFloat(measurement.corrected_40ar_radiogenic_sigma) || 0;
          const k39_sigma = parseFloat(measurement.corrected_39ar_potassium_sigma) || 0;
          if (rad40 > 0 && k39 > 0) {
            ar40_ar39_sigma = ar40_ar39 * Math.sqrt(
              Math.pow(rad40_sigma / rad40, 2) + Math.pow(k39_sigma / k39, 2)
            );
          }
        }
      }
      
      
      // Atmospheric 40Ar/36Ar ratio (typically 295.5)
      const atmAr40Ar36 = 295.5;
      
      // Calculate radiogenic 40Ar/39Ar ratio
      const ar40rad_ar39 = ar40_ar39 - (atmAr40Ar36 * ar36_ar39);
      
      // Skip if radiogenic ratio is negative or zero
      if (ar40rad_ar39 <= 0) {
        return null;
      }
      
      // Calculate age using: Age = (1/λ) * ln(1 + J * (40Ar*/39ArK))
      // where λ is the total decay constant and J is the irradiation parameter
      const lambda = decayConstants.total || 5.543e-10; // total decay constant (1/years)
      const J = jValue || 1e-3; // irradiation parameter
      
      const age = (1/lambda) * Math.log(1 + J * ar40rad_ar39) / 1e6; // Convert to Ma
      
      // Calculate uncertainty propagation (simplified)
      const ar40rad_ar39_sigma = Math.sqrt(
        Math.pow(ar40_ar39_sigma, 2) + 
        Math.pow(atmAr40Ar36 * ar36_ar39_sigma, 2)
      );
      
      const age_sigma = (age * ar40rad_ar39_sigma) / ar40rad_ar39;
      
      return {
        age: age,
        age_sigma: age_sigma,
        ar40rad_ar39: ar40rad_ar39,
        ar40rad_ar39_sigma: ar40rad_ar39_sigma
      };
    } catch (error) {
      console.error('Error calculating age:', error);
      return null;
    }
  }
  
  // Calculate cumulative 39Ar release percentage
  static calculateCumulative39Ar(measurements) {
    try {
      // Get 39Ar values for each measurement
      const ar39Values = measurements.map(m => {
        // Try multiple possible field names for 39Ar
        return parseFloat(m.corrected_39ar_potassium || m.measurement_ar39_vol_stp || m.ar39_vol) || 0;
      });
      
      // Calculate total 39Ar
      const totalAr39 = ar39Values.reduce((sum, val) => sum + val, 0);
      
      if (totalAr39 === 0) return measurements.map(() => 0);
      
      // Calculate cumulative percentages
      let cumulative = 0;
      return ar39Values.map(ar39 => {
        cumulative += ar39;
        return (cumulative / totalAr39) * 100;
      });
    } catch (error) {
      console.error('Error calculating cumulative 39Ar:', error);
      return measurements.map(() => 0);
    }
  }
  
  // Identify plateau steps using statistical criteria
  static identifyPlateau(ageData) {
    try {
      if (!ageData || ageData.length < 3) return { plateauSteps: [], plateauAge: null };
      
      const minPlateauSteps = 3; // Minimum steps required for plateau
      const maxMSWD = 2.5; // Maximum Mean Square of Weighted Deviates
      const minAr39Percent = 50; // Minimum 39Ar release for plateau
      
      let bestPlateau = { steps: [], mswd: Infinity, weightedMean: 0, uncertainty: 0 };
      
      // Try all possible consecutive step combinations
      for (let start = 0; start <= ageData.length - minPlateauSteps; start++) {
        for (let end = start + minPlateauSteps - 1; end < ageData.length; end++) {
          const steps = ageData.slice(start, end + 1);
          
          // Check if this segment meets minimum 39Ar release criterion
          const ar39Range = steps[steps.length - 1].cumAr39 - (start > 0 ? ageData[start - 1].cumAr39 : 0);
          if (ar39Range < minAr39Percent) continue;
          
          // Calculate weighted mean and MSWD
          const plateau = this.calculateWeightedMean(steps);
          
          // Check if MSWD is acceptable and better than current best
          if (plateau.mswd <= maxMSWD && plateau.mswd < bestPlateau.mswd) {
            bestPlateau = {
              steps: steps.map((_, i) => start + i),
              mswd: plateau.mswd,
              weightedMean: plateau.weightedMean,
              uncertainty: plateau.uncertainty,
              ar39Percent: ar39Range
            };
          }
        }
      }
      
      return {
        plateauSteps: bestPlateau.steps,
        plateauAge: bestPlateau.weightedMean,
        plateauAge_sigma: bestPlateau.uncertainty,
        mswd: bestPlateau.mswd,
        ar39Percent: bestPlateau.ar39Percent
      };
    } catch (error) {
      console.error('Error identifying plateau:', error);
      return { plateauSteps: [], plateauAge: null };
    }
  }
  
  // Calculate weighted mean and MSWD for a set of age measurements
  static calculateWeightedMean(steps) {
    try {
      if (steps.length === 0) return { weightedMean: 0, uncertainty: 0, mswd: Infinity };
      
      // Calculate weights (1/σ²)
      const weights = steps.map(step => {
        const sigma = step.age_sigma || 1;
        return 1 / (sigma * sigma);
      });
      
      const totalWeight = weights.reduce((sum, w) => sum + w, 0);
      
      // Calculate weighted mean
      const weightedSum = steps.reduce((sum, step, i) => sum + step.age * weights[i], 0);
      const weightedMean = weightedSum / totalWeight;
      
      // Calculate MSWD (Mean Square of Weighted Deviates)
      const sumSquaredDeviates = steps.reduce((sum, step, i) => {
        const deviation = step.age - weightedMean;
        return sum + weights[i] * deviation * deviation;
      }, 0);
      
      const n = steps.length;
      const mswd = n > 1 ? sumSquaredDeviates / (n - 1) : 0;
      
      // Calculate uncertainty on weighted mean
      const uncertainty = Math.sqrt(1 / totalWeight);
      
      return {
        weightedMean,
        uncertainty,
        mswd
      };
    } catch (error) {
      console.error('Error calculating weighted mean:', error);
      return { weightedMean: 0, uncertainty: 0, mswd: Infinity };
    }
  }
  
  // Deduplicate measurements based on key fields
  static deduplicateMeasurements(measurements) {
    const seen = new Map();
    const deduplicated = [];
    
    measurements.forEach((measurement, index) => {
      // Create a key based on age-related fields that should be unique
      const age = parseFloat(measurement.age) || 0;
      const age_sigma = parseFloat(measurement.age_sigma_analytical) || 0;
      const temp = parseFloat(measurement.temp || measurement.measurement_step_heat_temperature || measurement.temperature) || 0;
      const ar39 = parseFloat(measurement.corrected_39ar_potassium || measurement.measurement_ar39_vol_stp || measurement.ar39_vol) || 0;
      
      // Create a key from the important fields (rounded to avoid floating point issues)
      const key = `${age.toFixed(6)}_${age_sigma.toFixed(6)}_${temp.toFixed(2)}_${ar39.toFixed(10)}`;
      
      if (!seen.has(key)) {
        seen.set(key, true);
        // Add original index to track step numbers
        deduplicated.push({ ...measurement, originalIndex: index });
      }
    });
    
    return deduplicated;
  }

  // Process measurements to calculate plateau data
  static processPlateauData(measurements, jValue = 1e-3, decayConstants = { total: 5.543e-10 }) {
    try {
      if (!measurements || measurements.length === 0) {
        return null;
      }
      
      // Deduplicate measurements first
      const uniqueMeasurements = this.deduplicateMeasurements(measurements);
      
      if (uniqueMeasurements.length === 0) {
        return null;
      }
      
      // Calculate ages for each measurement
      const ageData = [];
      const cumAr39 = this.calculateCumulative39Ar(uniqueMeasurements);
      
      uniqueMeasurements.forEach((measurement, i) => {
        // Use existing age if available, otherwise calculate it
        let age, age_sigma, ar40rad_ar39;
        
        if (measurement.age && measurement.age_sigma_analytical) {
          // Use pre-calculated age data
          age = parseFloat(measurement.age);
          age_sigma = parseFloat(measurement.age_sigma_analytical);
          // Try to get radiogenic ratio if available
          ar40rad_ar39 = parseFloat(measurement.corrected_39ar_k_40ar_rad_atm_ratio || 0);
          if (ar40rad_ar39 === 0) {
            // Calculate from corrected values
            const rad40 = parseFloat(measurement.corrected_40ar_radiogenic) || 0;
            const k39 = parseFloat(measurement.corrected_39ar_potassium) || 0;
            ar40rad_ar39 = k39 > 0 ? rad40 / k39 : 0;
          }
        } else {
          // Calculate age using our method
          const ageCalc = this.calculateAge(measurement, jValue, decayConstants);
          if (!ageCalc) return; // Skip if calculation failed
          age = ageCalc.age;
          age_sigma = ageCalc.age_sigma;
          ar40rad_ar39 = ageCalc.ar40rad_ar39;
        }
        
        if (age && age_sigma) {
          ageData.push({
            step: (measurement.originalIndex !== undefined ? measurement.originalIndex : i) + 1,
            temperature: parseFloat(measurement.temp || measurement.measurement_step_heat_temperature || measurement.temperature) || 0,
            age: age,
            age_sigma: age_sigma,
            cumAr39: cumAr39[i],
            ar40rad_ar39: ar40rad_ar39,
            measurement: measurement,
            originalIndex: measurement.originalIndex
          });
        }
      });
      
      if (ageData.length === 0) return null;
      
      // Identify plateau
      const plateau = this.identifyPlateau(ageData);
      
      return {
        ageData,
        plateau,
        totalSteps: measurements.length,
        uniqueSteps: uniqueMeasurements.length,
        duplicatesRemoved: measurements.length - uniqueMeasurements.length
      };
    } catch (error) {
      console.error('Error processing plateau data:', error);
      return null;
    }
  }
}

export default PlateauCalculations;