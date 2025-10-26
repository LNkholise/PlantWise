from langchain_core.tools import tool
from .supabase import get_supabase_client 
import numpy as np
import pandas as pd
import os

db = get_supabase_client()

response = db.table("Crops").select("*").execute()

@tool
def advise_planting(temperature: float, humidity: float, temp_tolerance: float = 2.0, humidity_tolerance: float = 4.0) -> str:
    """
    Advises on what to plant, on what type of soil based on temperature in degrees Celsius and humidity in percentage.

    Returns a string with Crop Type, Soil Type, and Moisture.
    """
    df = pd.DataFrame(response.data)

    # Filter with tolerances ...
    filtered_df = df[
        (df["Temperature"].between(temperature - temp_tolerance, temperature + temp_tolerance)) &
        (df["Humidity"].between(humidity - humidity_tolerance, humidity + humidity_tolerance))
    ]

    if filtered_df.empty:
        return "No suitable crops found for the given conditions."

    output_df = filtered_df[["Moisture", "Soil Type", "Crop Type"]].sample(n=min(3, len(filtered_df)))

    return output_df.to_string(index=False)

@tool
def crops_by_soil(soil_type: str) -> str:
    """
    Returns crops suitable for a given soil type along with their ideal temperatures in degrees Celsius and humidities in percentages.

    Parameters:
    - soil_type (str): Type of soil (e.g., "Loamy", "Sandy", "Clayey", "Black", "Red")

    Returns:
    - str: A table containing Crop Type, Ideal Temperature, and Ideal Humidity
    """
    df = pd.DataFrame(response.data)

    # Filter by soil type
    filtered_df = df[df["Soil Type"].str.lower() == soil_type.lower()]

    if filtered_df.empty:
        return f"No crops found for soil type '{soil_type}'."

    # Select relevant columns
    output_df = filtered_df[["Crop Type", "Temperature", "Humidity"]].sample(n=min(3, len(filtered_df)))

    return output_df.to_string(index=False)

@tool
def simulate_crop_profitability(crop_name: str, n_simulations: int = 10000, confidence_level: float = 95.0) -> dict:
    """
    Simulates the profitability of a given crop using Monte Carlo simulation.

    Parameters:
    - crop_name (str): Name of the crop to simulate
    - n_simulations (int): Number of simulations to run
    - confidence_level (float): Confidence level for Value at Risk calculation

    Returns:
    - dict: A JSON-safe summary of the simulation results including mean return, 
            Value at Risk, and probability of loss.
    """
    
    returns = db.table("Returns").select("*").eq("Crop Type", crop_name).execute()
    data = returns.data

    if not data:
        return {"error": f"No return data found for crop '{crop_name}'."}

    df = pd.DataFrame(data)
    mean_return = float(df["Return"].iloc[0])
    std_dev = float(df["Std Dev"].iloc[0])

    # Monte Carlo simulation
    simulated_returns = np.random.normal(mean_return, std_dev, n_simulations)

    mean_simulated_return = float(np.mean(simulated_returns))
    var_threshold = 100 - confidence_level
    value_at_risk = float(np.percentile(simulated_returns, var_threshold))
    loss_probability = float(np.mean(simulated_returns < 0))
    
    return {
        "crop": crop_name,
        "mean_return": mean_simulated_return,
        "value_at_risk": value_at_risk,
        "loss_probability": loss_probability,
        "confidence_level": confidence_level
    }


all_tools = [advise_planting, crops_by_soil, simulate_crop_profitability]
