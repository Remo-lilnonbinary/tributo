from app.federated import run_federated_round


def test_federated_round_improves_over_single_node():
    result = run_federated_round(num_rounds=3)
    # Real FedAvg over non-IID nodes must beat the average single-institution model.
    assert result["after_accuracy"] > result["before_accuracy"]
    assert result["after_accuracy"] > result["chance_accuracy"]
    assert result["improvement_points"] > 0


def test_no_raw_data_leaves_a_node():
    result = run_federated_round(num_rounds=2)
    assert result["raw_data_shared"] is False
    assert result["aggregate_method"] == "FedAvg"
    assert len(result["nodes"]) == result["num_nodes"]
    for node in result["nodes"]:
        assert node["raw_rows_shared"] == 0
        assert node["local_examples"] > 0
