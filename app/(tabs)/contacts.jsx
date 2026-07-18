import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TextInput,
    Pressable,
    RefreshControl,
    Alert,
} from "react-native";
import * as Contacts from "expo-contacts";
import * as Clipboard from "expo-clipboard";

export default function ContactsScreen() {
    const [contacts, setContacts] = useState([]);
    const [filteredContacts, setFilteredContacts] = useState([]);
    const [search, setSearch] = useState("");
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        const { status } = await Contacts.requestPermissionsAsync();

        if (status !== "granted") {
            Alert.alert(
                "Permission Denied",
                "Contacts permission is required."
            );
            return;
        }

        const { data } = await Contacts.getContactsAsync({
            fields: [
                Contacts.Fields.Name,
                Contacts.Fields.FirstName,
                Contacts.Fields.LastName,
                Contacts.Fields.PhoneNumbers,
            ],
        });

        const validContacts = data.filter((contact) => {
            const fullName =
                contact.name ||
                `${contact.firstName || ""} ${contact.lastName || ""}`.trim();

            return fullName.length > 0;
        });

        setContacts(validContacts);
        setFilteredContacts(validContacts);
    };

    const refreshContacts = async () => {
        setRefreshing(true);
        await fetchContacts();
        setRefreshing(false);
    };

    const searchContacts = (text) => {
        setSearch(text);

        const filtered = contacts.filter((item) => {
            const fullName =
                item.name ||
                `${item.firstName || ""} ${item.lastName || ""}`;

            return fullName.toLowerCase().includes(text.toLowerCase());
        });

        setFilteredContacts(filtered);
    };

    const copyNumber = async (number) => {
        if (!number) {
            Alert.alert("No Number", "This contact has no phone number.");
            return;
        }

        await Clipboard.setStringAsync(number);

        Alert.alert(
            "Copied",
            "Contact number copied successfully."
        );
    };

    const renderItem = ({ item }) => {
        const fullName =
            item.name ||
            `${item.firstName || ""} ${item.lastName || ""}`.trim() ||
            "Unknown Contact";

        const phone =
            item.phoneNumbers && item.phoneNumbers.length > 0
                ? item.phoneNumbers[0].number
                : null;

        return (
            <View style={styles.card}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                        {fullName.charAt(0).toUpperCase()}
                    </Text>
                </View>

                <View style={styles.info}>
                    <Text style={styles.name}>
                        {fullName}
                    </Text>

                    <Text style={styles.number}>
                        {phone || "No Number"}
                    </Text>
                </View>

                <Pressable
                    style={styles.copyButton}
                    onPress={() => copyNumber(phone)}
                >
                    <Text style={styles.copyText}>Copy</Text>
                </Pressable>
            </View>
        );
    };

    return (
        <View style={styles.container}>

            <Text style={styles.heading}>
                Contacts
            </Text>

            <TextInput
                placeholder="Search Contact"
                style={styles.search}
                value={search}
                onChangeText={searchContacts}
            />

            <Text style={styles.counter}>
                Total Contacts : {filteredContacts.length}
            </Text>

            {filteredContacts.length === 0 ? (
                <View style={styles.empty}>
                    <Text style={styles.emptyText}>
                        No Contacts Found
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={filteredContacts}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={refreshContacts}
                        />
                    }
                />
            )}

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F4F6F8",
        padding: 15,
    },

    heading: {
        fontSize: 28,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 15,
    },

    search: {
        backgroundColor: "white",
        borderRadius: 10,
        padding: 12,
        marginBottom: 10,
        elevation: 2,
    },

    counter: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 10,
    },

    card: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "white",
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        elevation: 2,
    },

    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: "#2563EB",
        justifyContent: "center",
        alignItems: "center",
    },

    avatarText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 20,
    },

    info: {
        flex: 1,
        marginLeft: 15,
    },

    name: {
        fontSize: 17,
        fontWeight: "bold",
    },

    number: {
        color: "gray",
        marginTop: 3,
    },

    copyButton: {
        backgroundColor: "green",
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 8,
    },

    copyText: {
        color: "white",
        fontWeight: "bold",
    },

    empty: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    emptyText: {
        fontSize: 18,
        color: "gray",
        fontWeight: "bold",
    },
});