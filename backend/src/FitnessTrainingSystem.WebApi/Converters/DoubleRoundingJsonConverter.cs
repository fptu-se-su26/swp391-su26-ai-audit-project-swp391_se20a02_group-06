using System;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace FitnessTrainingSystem.WebApi.Converters;

public class DoubleRoundingJsonConverter : JsonConverter<double>
{
    public override double Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        return reader.GetDouble();
    }

    public override void Write(Utf8JsonWriter writer, double value, JsonSerializerOptions options)
    {
        writer.WriteNumberValue(Math.Round(value, 2));
    }
}

public class NullableDoubleRoundingJsonConverter : JsonConverter<double?>
{
    public override double? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        return reader.TokenType == JsonTokenType.Null ? null : reader.GetDouble();
    }

    public override void Write(Utf8JsonWriter writer, double? value, JsonSerializerOptions options)
    {
        if (value.HasValue)
        {
            writer.WriteNumberValue(Math.Round(value.Value, 2));
        }
        else
        {
            writer.WriteNullValue();
        }
    }
}
